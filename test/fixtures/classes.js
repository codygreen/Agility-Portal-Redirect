const course = {
    "id": 1000000000000000000,
    "name": "Cody_Test_Class",
    "description": "Unit-Test",
    "deleted": false
};

const blueprints = [
    {
    "id": 10000000,
    "link": "https://cloud.ravellosystems.com/#/0/library/blueprints/85296619",
    "accessible": true
    }
];

const creator = {
    "id": 100000000,
    "name": "John",
    "link": "https://cloud.ravellosystems.com/#/0/admin/users/?selectedIds=;100000000",
    "accessible": true,
    "surname": "Doe",
    "email": "j.doe@email.com",
    "username": "a100000/j.doe@email.com",
    "identityDomain": "a100000"
};

const costBucket = {
    "id": 10000000,
    "accessible": true,
    "deleted": false
};

const trainer = {
    "id": 100000000,
    "name": "John",
    "link": "https://cloud.ravellosystems.com/#/0/admin/users/?selectedIds=;100000000",
    "accessible": true,
    "surname": "Doe",
    "email": "j.doe@email.com",
    "username": "a100000/j.doe@email.com",
    "identityDomain": "a100000"
};

module.exports.baseClasses = [
    {
        "id": 1000000000000000000,
        "creationTime": 1000000000000,
        "modificationTime": 1000000000000,
        "name": "Base Class A",
        ...course,
        "optimizationLevel": "COST_OPTIMIZED",
        "startTime": 1000000000000,
        "endTime": 1000000000000,
        "studentCount": "1",
        ...blueprints,
        ...costBucket,
        ...trainer,
        "timezone": "America/Chicago",
        ...creator,
        "status": "INACCESSIBLE"
    },
    {
        "id": 1000000000000000000,
        "creationTime": 1000000000000,
        "modificationTime": 1000000000000,
        "name": "Base Class B",
        ...course,
        "optimizationLevel": "COST_OPTIMIZED",
        "startTime": 1000000000000,
        "endTime": 10000000010000,
        "studentCount": "1",
        ...blueprints,
        ...costBucket,
        ...trainer,
        "timezone": "America/Chicago",
        ...creator,
        "status": "STARTED"
    }
];

const applications = [
    {
        "id": 1000000000000000000,
        "creationTime": 1000000000000,
        "modificationTime": 1000000000000,
        "classId": 1000000000000000000,
        "blueprintId": 10000000,
        "appRef": {
            "id": 1000000000000,
            "name": "ravello-class-test##unit-test-bp##1000000000000000000",
            "link": "https://cloud.ravellosystems.com/#/0/apps/10000000000",
            "accessible": true,
            "status": "STOPPED"
        },
        "ephAccessToken": {
            "id": 1000000000000,
            "name": "TP token for application ravello-class-test##unit-test-bp##1000000000000000000##10000000000",
            "link": "https://access.ravellosystems.com/simple/#/1000000000000000000/apps/1000000000",
            "accessible": true,
            "token": "1000000000000000000"
        },
        "studentId": 1000000000000000000
    }
];

module.exports.baseClassUsers = [
    {
        "id": 1000000000000000000,
        "creationTime": 1000000000000,
        "modificationTime": 1000000000000,
        "firstName": "mickey",
        "lastName": "mouse",
        "email": "m.mouse@email.com",
        "classId": 1000000000000000000,
        applications
    },
    {
        "id": 1000000000000000000,
        "creationTime": 1000000000000,
        "modificationTime": 1000000000000,
        "firstName": "minney",
        "lastName": "mouse",
        "email": "mi.mouse@email.com",
        "classId": 1000000000000000000,
        applications
    },
    {
        "id": 1000000000000000000,
        "creationTime": 1000000000000,
        "modificationTime": 1000000000000,
        "firstName": "mortimer",
        "lastName": "mouse",
        "email": "morty@email.com",
        "classId": 1000000000000000000,
        applications
    },
];