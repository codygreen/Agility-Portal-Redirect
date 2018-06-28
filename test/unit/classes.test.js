'use strict';

const chai = require('chai');
const expect = chai.expect;
const chaiAsPromised = require('chai-as-promised');
const proxyquire = require('proxyquire');
const dotenv = require('dotenv').config();


chai.use(chaiAsPromised);
chai.should();

const f = require('../fixtures/classes');
let RavelloClass = null;


let RavellojsMock = {};
RavellojsMock.config = ({username, password, domain}) => {console.log('WTF')};
RavellojsMock.getClasses = () => {return new Promise((resolve, reject) => resolve(f.baseClasses))};

describe('Unit Testing for RavelloClasses Class', function () {
    beforeEach(() => {
        RavelloClass = proxyquire('../../ravelloClasses', {
            'ravello-js' : RavellojsMock
        });
    });
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
            classes.getClasses(classes.classesState.accessible).should.eventually.have.length(1),
            classes.getClasses(classes.classesState.accessible).should.eventually.deep.include(f.baseClasses[1]),
            classes.getClasses(classes.classesState.inaccessible).should.eventually.have.length(1),
            classes.getClasses(classes.classesState.inaccessible).should.eventually.deep.include(f.baseClasses[0]),
            classes.getClasses().should.eventually.have.length(2),
            classes.getClasses().should.eventually.equal(f.baseClasses)
        ]);
    });
});


