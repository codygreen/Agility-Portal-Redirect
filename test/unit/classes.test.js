'use strict';

const chai = require('chai');
const expect = chai.expect;
const chaiAsPromised = require('chai-as-promised');
const proxyquire = require('proxyquire');
const dotenv = require('dotenv').config();
const RedisMock = require('redis-mock');


chai.use(chaiAsPromised);
chai.use(require('chai-url'));
chai.should();

const f = require('../fixtures/classes');

let RavelloClass = null;

let RavellojsMock = {};
RavellojsMock.config = ({username, password, domain}) => {};
RavellojsMock.getClasses = () => {return new Promise((resolve, reject) => resolve(f.baseClasses))};
RavellojsMock.getClassStudents = ({classId}) => {return new Promise((resolve, reject) => resolve(f.baseClassUsers))};
RavellojsMock.updateCache = () => {return new Promise((resolve, reject) => resolve(f.baseClasses))};
RavellojsMock.updateClass = (body) => {return new Promise((resolve, reject) => resolve(true))};

describe('Unit Testing for RavelloClasses Class', function () {
    beforeEach(() => {
        RavelloClass = proxyquire('../../ravelloClasses', {
            'ravello-js' : RavellojsMock,
            'redis' : {
                createClient: RedisMock.createClient,
            }
        });
    });
    it('Test getClasses method', function () {
        expect(process.env.DOMAIN).to.not.equal(undefined);
        expect(process.env.PASSWORD).to.not.equal(undefined);
        expect(process.env.USERNAME).to.not.equal(undefined);

        (function () {
            const classes = new RavelloClass();
        }).should.throw(Error);

        (function () {
            const classes = new RavelloClass({
                username: process.env.USERNAME,
            });
        }).should.throw(Error);

        (function () {
            const classes = new RavelloClass({
                password: process.env.PASSWORD,
                username: process.env.USERNAME,
            });
        }).should.throw(Error);

        const classes = new RavelloClass({
            domain: process.env.DOMAIN,
            password: process.env.PASSWORD,
            username: process.env.USERNAME,
        });

        return Promise.all([
            classes.getClasses(classes.classesState.active).should.eventually.have.length(2),
            classes.getClasses(classes.classesState.active).should.eventually.deep.include(f.baseClasses[1]),
            classes.getClasses(classes.classesState.inaccessible).should.eventually.have.length(1),
            classes.getClasses(classes.classesState.inaccessible).should.eventually.deep.include(f.baseClasses[2]),
            classes.getClasses().should.eventually.have.length(3),
            classes.getClasses().should.eventually.equal(f.baseClasses)
        ]);
    });

    it('Test processClass method', function() {
        const classes = new RavelloClass({
            domain: process.env.DOMAIN,
            password: process.env.PASSWORD,
            username: process.env.USERNAME,
        });

        return classes.processClass().should.eventually.be.rejected;
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
        
        let promises = [];
        return classes.getClassStudents().should.eventually.be.rejected;
        return classes.getClassStudents({classId: 'asdfgh123456'})
            .then((res) => {
                res.should.be.equal(f.baseClassUsers);
                expect(res[0].applications[0].ephAccessToken.link).to.contain.path('/simple/');  
            });
    });

    it('Test updateClassDescriptionWithHash method', function() {
        const classes = new RavelloClass({
            domain: process.env.DOMAIN,
            password: process.env.PASSWORD,
            username: process.env.USERNAME,
        });

        return Promise.all([
            classes.updateClassDescriptionWithHash().should.eventually.be.rejected,
            classes.updateClassDescriptionWithHash(f.baseClasses[0]).should.eventually.be.rejected,
            classes.updateClassDescriptionWithHash(f.baseClasses[0], '3848809716').should.eventually.be.equal(true),
        ]);
    });

    it('Test processClasses method', function() {
        const classes = new RavelloClass({
            domain: process.env.DOMAIN,
            password: process.env.PASSWORD,
            username: process.env.USERNAME,
        });
        return classes.processClasses()
            .then((res) => {
                return res;
            })
            .catch((err) => {
                throw new Error(err);
            });
    });

    it('Test getCache method', function() {
        const classes = new RavelloClass({
            domain: process.env.DOMAIN,
            password: process.env.PASSWORD,
            username: process.env.USERNAME,
        });

        return Promise.all([
            classes.getCache().should.eventually.be.rejected,
            classes.getCache('12345').should.eventually.be.equal(null),
            classes.getCache('3848809716/1').should.eventually.be.equal('https://access.ravellosystems.com/simple/#/1000000000000000000/apps/1000000000')
        ]);
    })
});


