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

    // obtain a cache entry
    getCache(key = null) {
        return new Promise((resolve, reject) => {
            if(key === null) {
                return reject(new Error('getCache ERROR: key cannot be null'));
            }

            const client = redis.createClient(6379, config.redisSlave, {password: process.env.REDIS_PASSWORD});
            const getAsync = promisify(client.get).bind(client);

            return getAsync(key)
            .then((res) => {
                client.quit();
                resolve(res);
            })
            .catch((err) => {
                client.quit();
                reject(err);
            });
        });
    }

    // obtain an array of classes from Ravello
    getClasses(status = null) {
        return new Promise((resolve, reject) => {
            r.getClasses().then((res) => {
                // console.log('RAVELLO TEST GETCLASSES:');
                // console.log(res);
                
                // process classes for the desired status
                let payload = [];
                switch(status) {
                    case null: {
                        // return all classes
                        return resolve(res);
                    }
                    case this.classesState.active: {
                        // return classes who's state is active (note, this is not an actual Ravello state)
                        const now = new Date();
                        return resolve(res.filter(c => c.endTime > now));
                    } 
                    default: {
                        // return classes who's state matches the supplied state
                        return resolve(res.filter(c => c.status === status));
                    }
                };

            }).catch((err) => {
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

    // calculate a hash for the class
    getHash(id = null) {
        // if the classId is a number convert to string
        const classId = isNaN(id) ? id : id.toString(); 
        
        // create a hash from the string
        const hash = crc.crc32(classId);

        // return the hash
        return hash;
    }

    // update the class description with the class id
    updateClassDescriptionWithHash(classObject = null, hash = null) {
        return new Promise((resolve, reject) => {
            //ensure we have the required variables
            if(classObject === null) return reject(new Error('updateClassDescriptionWithHash requires a class object'));
            if(hash === null) return reject(new Error('updateClassDescriptionWithHash requires a hash value'));
            
            let description = `Agility_id: ${hash}; `;;

            // Check if the class description already has a hash
            if(classObject.hasOwnProperty('description')) {                
                const index = classObject.description.indexOf('Agility_id:');
                if(index === -1) {
                    // hash is not in the description
                    description += classObject.description; 
                } else {
                    // find the end of the hash starting at the begining of the hash
                    let end = classObject.description.indexOf(';', index);
                    let descriptionHash = classObject.description.substring(index + 12, end);
                    
                    // determine if the hashes match, if so resolve
                    if(hash === descriptionHash) {
                        return resolve(true);
                    } else {
                        // replace the hash with the new hash
                        description = classObject.description.replace(descriptionHash, hash);
                    }
                }
            }

            // prepare to update the description
            let body = Object.assign({ }, classObject);
            body.description = description;
            return r.updateClass(body)
            .then((res) => {
                resolve(true);
            })
            .catch((err) => {
                reject(err);
            });
        });
    }

    // get the class students, update the description with the hash and update the cache
    processClass(classObject = null) {
        return new Promise((resolve, reject) => {
            let studentPromises = [];
            let hash = this.getHash(classObject.id);

            //ensure we have the required parameters
            if(classObject === null) {
                return reject(new Error('processClass requires a class object'));
            }

            // get the students for this class
            return this.getClassStudents(classObject.id)
            .then((students) => {
                // ensure there are students to process
                if(Array.isArray(students) && students.length > 0) {
                    // process each student
                    students.map(student => studentPromises.push(this.processStudent(student, hash)));
                }
                else {
                    // no students in this class, resolve
                    console.error('processClass ERROR: no students found for class: '+ classObject.id);
                    return resolve();
                }
                return;
            })
            .then(() => {
                // update the description
                return this.updateClassDescriptionWithHash(classObject, hash);
            })
            .then(() => {
                // process each student
                return Promise.all(studentPromises);
            })
            .then((res) => {
                // class has been processed, we can resolve with the students unique key and Ravello links
                resolve(res);

            })
            .catch((err) => {
                reject(err);
            });
         });
    }

    // process the student
    processStudent(student = null, classHash = null) {
        return new Promise((resolve, reject) => {
            // make sure applications are assigned to the student
            if(Array.isArray(student.applications) && student.applications.length > 0) {
                // extract the student number and ephemeral Access Token link
                const studentNumber = student.lastName;
                const link = student.applications[0].ephAccessToken.link;
                // create the unique key for this student
                const classIdWithStudentNumber = classHash + '/' + studentNumber;
                resolve({
                    key: classIdWithStudentNumber, 
                    link: link
                });
            } else {
                reject(new Error('processStudent ERROR: no applications associated with student: ' + student.id));
            }
        });
    }

    // process each class to gernerate a unique hash and update the cache with each students Ravello link
    processClasses() {
        return new Promise((resolve, reject) => {
            let classPromises = [];
            let classes = [];
            let cache = new Map();
            let hrstart = process.hrtime();

            // obtain active classes
            return this.getClasses(this.classesState.active)
            .then((classes) => {
                classes.map(c => {
                    // store the class
                    classes.push(c);
                    
                    // add the class to the promise array 
                    classPromises.push(this.processClass(c));
                });
                return;
            })
            .then(() => {
                // process the classes
                return Promise.all(classPromises);
            })
            .then((res) => {
                return this.updateCache(res);
            })
            .then((res) => {
                // return resolve(true);
                let hrend = process.hrtime(hrstart);

                let payload = {
                    count: classPromises.length,
                    executionTime: `${hrend[0]} seconds`,
                };
                return resolve(payload);
            })
            .catch((err) => {
                return reject(err);
            });
        });
    }



    // updates the cache with the map data provided
    updateCache(data) {
        return new Promise((resolve, reject) => {
            const client = redis.createClient(6379, config.redisMaster, {password: process.env.REDIS_PASSWORD});
            const cacheMulti = client.multi();
            
            // map through the results
            if(Array.isArray(data) && data.length > 0) {
                data.map(res => {
                    res.map(({key, link}) => {
                        cacheMulti.set(key, link);
                    });
                });

            } else {
                reject(new Error('updateCache ERROR: expecting data to be an array of promise results'));
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
