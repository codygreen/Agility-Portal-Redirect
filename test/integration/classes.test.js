'use strict';

const chai = require('chai');
const expect = chai.expect;
const chaiAsPromised = require('chai-as-promised');
const proxyquire = require('proxyquire');
const dotenv = require('dotenv').config();


chai.use(chaiAsPromised);
chai.should();

const f = require('../fixtures/classes');
const RavelloClass = require('../../ravelloClasses');

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

        return Promise.all([
            classes.getClasses(classes.classesState.accessible).should.eventually.be.fulfilled,
        ]);
        // return classes.getClasses().then((res) => {
        //     console.log(res);
        // });
    });
});


