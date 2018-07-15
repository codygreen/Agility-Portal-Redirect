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

describe('Integration Testing for RavelloClasses Class', function () {
    this.timeout(10000);
    let classes = null;
    before(function() {
        expect(process.env.DOMAIN).to.not.equal(undefined);
        expect(process.env.PASSWORD).to.not.equal(undefined);
        expect(process.env.USERNAME).to.not.equal(undefined);
        
        classes = new RavelloClass({
            domain: process.env.DOMAIN,
            password: process.env.PASSWORD,
            username: process.env.USERNAME,
        });
    });
    // it('Test getClasses', function () {
    //     return classes.getClasses(classes.classesState.active)
    //         .then((res) => {
    //             console.log('TEST: ' + res[0].id);
    //             console.log(res);
    //             expect(res).to.not.be.empty;
    //             expect(res[0]).to.include.keys('id');
    //             expect(res[0]).to.include.keys('status');
    //         });
    // });

    // it('Test getClassStudents method', function() { 
    //     expect(process.env.INTEGRATION_CLASS_ID).to.not.be.null;       
    //     return classes.getClassStudents(process.env.INTEGRATION_CLASS_ID)
    //         .then((res) => {
    //             // make sure there are students for this class
    //             expect(res).to.not.be.empty;
    //             expect(res[0]).to.include.keys('id');
    //             expect(res[0].applications).to.not.be.empty;
    //             expect(res[0].applications[0]).to.include.keys('ephAccessToken');
    //             expect(res[0].applications[0].ephAccessToken).to.include.keys('link');
    //             expect(res[0].applications[0].ephAccessToken.link).to.contain.path('/simple/');
    //         });
    // });

    it('Test processClasses method', function() {
        return classes.processClasses()
            .then((res) => {
                console.log('TEST2:');
                console.log(res);
            });
    });

    // it('Test setClassRedirectId method', function() {
    //     return classes.setClassRedirectId(process.env.INTEGRATION_CLASS_ID).should.eventually.be.fulfilled;
    // });
});


