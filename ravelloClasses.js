/**
 * Copyright 2016, 2017 F5 Networks, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';

const config = require('./config/');
const dotenv = require('dotenv').config();
const crc = require('crc');
const r = require('ravello-js');
const redis = require('redis');
const {promisify} = require('util');

class RavelloClasses {
    constructor({ username = null, password = null, domain = null, debug = true} = {}) {
        if (!username) {
            throw new Error('RavelloAuth.constructor Error: a username was not supplied');
        }
      
        if (!password) {
            throw new Error('RavelloAuth.constructor Error: a password was not supplied');
        }

        if (!domain) {
            throw new Error('RavelloAuth.constructor Error: a domain was not supplied');
        }

        this.classesState = {
            active: 'ACTIVE',
            draft: 'DRAFT',
            inaccessible: 'INACCESSIBLE',
            started: 'STARTED',
            stopped: 'STOPPED',

        }
        
        // map argument to this.argument
        Object.keys(arguments[0]).map(key => this[key] = arguments[0][key]);

        // build ravello-js conf 
        const conf = {
            //debug ? r.conf.Logger : Logger: (function() {}),
            credentials: {
                domain: this.domain,
                password: this.password,
                username: this.username,
            }
        };
        r.configure(conf);
    };

    // obtain an array of classes from Ravello
    getClasses(status = null) {
        return new Promise((resolve, reject) => {
            r.getClasses().then((res) => {
                
                // process classes for the desired status
                let payload = [];
                switch(status) {
                    case null: {
                        // return all classes
                        return resolve(res);
                        break;
                    }
                    case this.classesState.active: {
                        // return classes who's state is not inaccessible
                        // note: accessible is not a valide state in Ravello, so we add the logic here
                        const now = new Date();
                        return resolve(res.filter(c => c.endTime > now));
                        //return resolve(res.filter(c => c.status !== this.classesState.inaccessible));
                        break;
                    } 
                    default: {
                        // return classes who's state matches the supplied state
                        return resolve(res.filter(c => c.status === status));
                        break;
                    }
                };

            }).catch((err) => {
                console.error('ERROR GET CLASSES: ' + err);
                reject(err);
            });
        });
    }

    // obtain an array of students associated with a particular class
    getClassStudents(classId = null) {
        return new Promise((resolve, reject) => {
            if(classId === null) 
                return reject(new Error('ERROR: getClassStudents requires a classId'));

            r.getClassStudents({id: classId}).then((res) => {
                return resolve(res);
            }).catch((err) => {
                return reject(err);
            });
        });
    }

    // update the class description with the Agility redirect Id
    // TODO: pass the crc32 hash in versus calculating it in this method
    setClassRedirectId(classId = null) {
        return new Promise((resolve, reject) => {
            if(classId === null)
                return reject(new Error('ERROR: setClassRedirectId requires a classId'));

            // obtain class data
            r.getClass({id: classId}).then((res) => {
                if(!res) 
                    return reject(new Error('ERROR setClassRedirectId: unable to get class data'));
                   
                // now let's add the redirect Id to the class description
                const id = crc.crc32(res.id);
                let body = Object.assign({ }, res);
                body.description = `Agility_id: ${id} ${res.description}`;
                return r.updateClass(body);
            })
            .then((res) => {
                if(!res)
                    return reject(new Error('ERROR setClassRedirectId: unable to update class description'));
                return resolve(true);
            }).catch((err) => {
                return reject(err);
            });
        });
    }

    // update the cache with active class data
    processClasses() {
        return new Promise((resolve, reject) => {
            let promises = [];
            let classIds = [];
            let cache = new Map();

            // obtain active classes
            return this.getClasses(this.classesState.active)
            .then((classes) => {
                console.log('length: ', classes.length);
                classes.map(c => {
                    console.log('adding to promises:');
                    // determine class id
                    console.log(c);
                    console.log(typeof(c.id));
                    // make sure the class ID is in the correct format
                    const classId = isNaN(c.id) ? c.id : c.id.toString(); 
                    const id = crc.crc32(classId);
                    console.log('class id: ' + id);
                    classIds.push(id);
                    // update Ravello Class description with id
                    // TODO: update Ravello Class ID
                    promises.push(this.getClassStudents(c.id));
                });
                return;
            })
            .then(() => {
                console.log('PROMISE LENGTH: ', promises.length);
                return Promise.all(promises);
            })
            .then((res) => {
                console.log('PROMISE ALL RESULTS LENGTH:' + res.length);
                let i = 0;
                res.map(c => {
                    console.log('class students:');
                    console.log(c);
                    if(Array.isArray(c) && c.length > 0) {
                        // process the students in this class
                        c.map(student => {
                            console.log('student:');
                            console.log(student);
                            // make sure applications are assigned to the student
                            if(Array.isArray(student.applications) && student.applications.length > 0) {
                                // extract the student number and ephemeral Access Token link
                                const studentNumber = student.lastName;
                                const link = student.applications[0].ephAccessToken.link;
                                console.log('student number:' + studentNumber);
                                console.log('student link:' + link);
                                // store the student link in the cache
                                const classIdWithStudentNumber = classIds[i] + '/' + studentNumber;
                                console.log('TEST CACHE: ' + classIdWithStudentNumber);
                                cache.set(classIdWithStudentNumber, link);
                            } else {
                                console.error('ERROR: student applications must be an array with length > 0');
                            }
                        })
                    } else {
                        console.error('ERROR: class students  must be an array with length > 0');
                    }
                    console.log('cache data:');
                    console.log(cache);
                    // iterate the class counter
                    i++;
                });
                //return resolve();
                return true;
            })
            .then(() => {
                return this.updateCache(cache);
            })
            .then((res) => {
                return resolve(true);
            })
            .catch((err) => {
                return reject(err);
            });
        });
    }



    // updates the cache with the map data provided
    updateCache(data) {
        return new Promise((resolve, reject) => {
            const client = redis.createClient();
            const cacheMulti = client.multi();
            

            console.log('MAP ITERATE');
            const iterator1 = data[Symbol.iterator]();
            for(let item of iterator1) {
                cacheMulti.set(item[0], item[1]);
            }

            cacheMulti.exec((err, replies) => {
                client.quit();
                if(err) {
                    reject(err);
                } else {
                    resolve(replies);
                }
            });
        });
    }
}

module.exports = RavelloClasses;