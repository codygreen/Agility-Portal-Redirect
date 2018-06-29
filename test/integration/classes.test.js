'use strict';

const chai = require('chai');
const expect = chai.expect;
const chaiAsPromised = require('chai-as-promised');
const proxyquire = require('proxyquire');
const dotenv = require('dotenv').config();


chai.use(chaiAsPromised);
chai.use(require('chai-url'));
chai.should();

const f = require('../fixtures/classes');
const RavelloClass = require('../../ravelloClasses');
let classIds = [];

describe('Integration Testing for RavelloClasses Class', function () {
    this.timeout(5000);
    it('Test getClasses', function () {
        expect(process.env.DOMAIN).to.not.equal(undefined);
        expect(process.env.PASSWORD).to.not.equal(undefined);
        expect(process.env.USERNAME).to.not.equal(undefined);
        
        const classes = new RavelloClass({
            domain: process.env.DOMAIN,
            password: process.env.PASSWORD,
            username: process.env.USERNAME,
        });

        return classes.getClasses(classes.classesState.accessible)
            .then((res) => {
                expect(res).to.not.be.empty;
                expect(res[0]).to.include.keys('id');
                expect(res[0]).to.include.keys('status');

                //obtain a classId that has students
                res.map(c => classIds.push(c.id));
                expect(classIds).to.not.be.empty;
            });
    });

    it('Test getClassStudents method', function() {
        expect(process.env.DOMAIN).to.not.equal(undefined);
        expect(process.env.PASSWORD).to.not.equal(undefined);
        expect(process.env.USERNAME).to.not.equal(undefined);
        expect(classIds).to.not.be.empty;

        const classes = new RavelloClass({
            domain: process.env.DOMAIN,
            password: process.env.PASSWORD,
            username: process.env.USERNAME,
        });
        
        return classes.getClassStudents(classIds[0])
            .then((res) => {
                // make sure there are students for this class
                if(res.length === 0) {
                    expect(classIds.length).to.be.at.least(2);
                    return classes.getClassStudents(classIds[1]);
                } else {
                    expect(res).to.not.be.empty;
                    expect(res[0]).to.include.keys('id');
                    expect(res[0].applications).to.not.be.empty;
                    expect(res[0].applications[0]).to.include.keys('ephAccessToken');
                    expect(res[0].applications[0].ephAccessToken).to.include.keys('link');
                    expect(res[0].applications[0].ephAccessToken.link).to.contain.path('/simple/');
                }
            }).then((res) => {
                // first class didn't have students so we're trying class2
                expect(res).to.not.be.empty;
                expect(res[0]).to.include.keys('id');
                expect(res[0].applications).to.not.be.empty;
                expect(res[0].applications[0]).to.include.keys('ephAccessToken');
                expect(res[0].applications[0].ephAccessToken).to.include.keys('link');
                expect(res[0].applications[0].ephAccessToken.link).to.contain.path('/simple/');
            });
    });
});


