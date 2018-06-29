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
let RavelloClass = null;


let RavellojsMock = {};
RavellojsMock.config = ({username, password, domain}) => {console.log('WTF')};
RavellojsMock.getClasses = () => {return new Promise((resolve, reject) => resolve(f.baseClasses))};
RavellojsMock.getClassStudents = ({classId}) => {return new Promise((resolve, reject) => resolve(f.baseClassUsers))};

describe('Unit Testing for RavelloClasses Class', function () {
    beforeEach(() => {
        RavelloClass = proxyquire('../../ravelloClasses', {
            'ravello-js' : RavellojsMock
        });
    });
    it('Test getClasses method', function () {
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
    it('Test getClassStudents method', function() {
        expect(process.env.DOMAIN).to.not.equal(undefined);
        expect(process.env.PASSWORD).to.not.equal(undefined);
        expect(process.env.USERNAME).to.not.equal(undefined);

        const classes = new RavelloClass({
            domain: process.env.DOMAIN,
            password: process.env.PASSWORD,
            username: process.env.USERNAME,
        });

        //return classes.getClassStudents({classId: 'asdfgh123456'}).should.eventually.be.fulfilled;
        
        let promises = [];
        return classes.getClassStudents({classId: 'asdfgh123456'})
            .then((res) => {
                res.should.be.equal(f.baseClassUsers);
                console.log(res[0]);
                expect(res[0].applications[0].ephAccessToken.link).to.contain.path('/simple/')
                
            });
    });
});


