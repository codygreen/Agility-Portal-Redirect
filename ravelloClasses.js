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
const r = require('ravello-js');

class RavelloClasses {
    constructor({ username = null, password = null, domain = null } = {}) {
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
            accessible: 'ACCESSIBLE',
            draft: 'DRAFT',
            inaccessible: 'INACCESSIBLE',
            started: 'STARTED',
            stopped: 'STOPPED',

        }
        
        // map argument to this.argument
        Object.keys(arguments[0]).map(key => this[key] = arguments[0][key]);

        // build ravello-js conf 
        const conf = {
            Logger: (function() {}),
            credentials: {
                domain: this.domain,
                password: this.password,
                username: this.username,
            }
        };
        r.configure(conf);
    };

    getClasses(status = null) {
        return new Promise((resolve, reject) => {
            r.getClasses().then((res) => {
                // process classes for the desired status
                let payload = [];

                switch(status) {
                    case null: {
                        return resolve(res);
                        break;
                    }
                    case this.classesState.accessible: {
                        return resolve(res.filter(c => c.status !== this.classesState.inaccessible));
                        break;
                    } 
                    default: {
                        return resolve(res.filter(c => c.status === status));
                        break;
                    }
                    // case 'accessible': {
                    //     // return anything that is not inactive
                    //     return resolve(res.filter(c => c.status !== 'INACCESSIBLE'));
                    //     // res.map(x => {
                    //     //     if(x.status !== 'INACCESSIBLE') {
                    //     //         payload.push(x);
                    //     //     }
                    //     // });
                    //     // return resolve(payload);
                    //     break;
                    // }
                    // case 'inaccessible': {
                    //     // return inactive classes
                    //     return resolve(res.filter(c => c.status === 'INACCESSIBLE'));
                    //     break;
                    // }
                    // default:  {
                    //     // return all classes
                    //     return resolve(res);
                    //     break;
                    // }
                };

            }).catch((err) => {
                console.error('ERROR GET CLASSES: ' + err);
                reject(err);
            });
        });
    }
}

module.exports = RavelloClasses;