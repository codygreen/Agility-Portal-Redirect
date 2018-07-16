module.exports.baseClasses = [
    { id: 'fdd83588-a3da-4130-9fba-123456789098',
        creationTime: '1517191191851',
        modificationTime: '1531585579392',
        name: 'Cody Test Class',
        "description": "Agility_id:3848809716 ravello automation test",
        course:
        { id: '99034067-fec9-4207-b5c7-123456789098',
            name: 'Cody_Test_Class',
            description: 'Unit-Test',
            deleted: false },
        optimizationLevel: 'COST_OPTIMIZED',
        startTime: '1531616400000',
        endTime: '1534129200000',
        studentCount: '2',
        blueprints:
        [ { id: '10000000',
            link: 'https://cloud.ravellosystems.com/#/0/library/blueprints/10000000',
            accessible: true } ],
        costBucket: { id: '83034265', accessible: true, deleted: false },
        trainer:
        { id: '10000000',
            name: 'Cody',
            link: 'https://cloud.ravellosystems.com/#/0/admin/users/?selectedIds=;10000000',
            accessible: true,
            surname: 'Green',
            email: 'fake@email.com',
            username: 'a100000/fake@email.com',
            identityDomain: 'a100000' },
        timezone: 'America/Chicago',
        creator:
        { id: '10000000',
            name: 'Cody',
            link: 'https://cloud.ravellosystems.com/#/0/admin/users/?selectedIds=;10000000',
            accessible: true,
            surname: 'Green',
            email: 'fake@email.com',
            username: 'a100000/fake@email.com',
            identityDomain: 'a100000' },
        status: 'STOPPED' 
    },
    { id: 'fdd83588-a3da-4130-9fba-0987654342123',
        creationTime: '1517191191851',
        modificationTime: '1531585579392',
        name: 'Cody Second Test Class',
        "description": "ravello automation test",
        course:
        { id: '99034067-fec9-4207-b5c7-098765432123',
            name: 'Cody_Test_Class',
            description: 'Unit-Test',
            deleted: false },
        optimizationLevel: 'COST_OPTIMIZED',
        startTime: '1531616400000',
        endTime: '1534129200000',
        studentCount: '2',
        blueprints:
        [ { id: '10000000',
            link: 'https://cloud.ravellosystems.com/#/0/library/blueprints/10000000',
            accessible: true } ],
        costBucket: { id: '83034265', accessible: true, deleted: false },
        trainer:
        { id: '10000000',
            name: 'Cody',
            link: 'https://cloud.ravellosystems.com/#/0/admin/users/?selectedIds=;10000000',
            accessible: true,
            surname: 'Green',
            email: 'fake@email.com',
            username: 'a100000/fake@email.com',
            identityDomain: 'a100000' },
        timezone: 'America/Chicago',
        creator:
        { id: '10000000',
            name: 'Cody',
            link: 'https://cloud.ravellosystems.com/#/0/admin/users/?selectedIds=;10000000',
            accessible: true,
            surname: 'Green',
            email: 'fake@email.com',
            username: 'a100000/fake@email.com',
            identityDomain: 'a100000' },
        status: 'STOPPED' 
    },
    { id: 'fdd83588-a3da-4130-9fba-0987654342123',
        creationTime: '1517191191851',
        modificationTime: '1517191191851',
        name: 'Cody Inaccessible Test Class',
        course:
        { id: '99034067-fec9-4207-b5c7-098765432123',
            name: 'Cody_Test_Class',
            description: 'Unit-Test',
            deleted: false },
        optimizationLevel: 'COST_OPTIMIZED',
        startTime: '1531616400000',
        endTime: '1517191191851',
        studentCount: '2',
        blueprints:
        [ { id: '10000000',
            link: 'https://cloud.ravellosystems.com/#/0/library/blueprints/10000000',
            accessible: true } ],
        costBucket: { id: '83034265', accessible: true, deleted: false },
        trainer:
        { id: '10000000',
            name: 'Cody',
            link: 'https://cloud.ravellosystems.com/#/0/admin/users/?selectedIds=;10000000',
            accessible: true,
            surname: 'Green',
            email: 'fake@email.com',
            username: 'a100000/fake@email.com',
            identityDomain: 'a100000' },
        timezone: 'America/Chicago',
        creator:
        { id: '10000000',
            name: 'Cody',
            link: 'https://cloud.ravellosystems.com/#/0/admin/users/?selectedIds=;10000000',
            accessible: true,
            surname: 'Green',
            email: 'fake@email.com',
            username: 'a100000/fake@email.com',
            identityDomain: 'a100000' },
        status: 'INACCESSIBLE' 
    },
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
        "lastName": "1",
        "email": "m.mouse@email.com",
        "classId": 1000000000000000001,
        applications
    },
    {
        "id": 1000000000000000000,
        "creationTime": 1000000000000,
        "modificationTime": 1000000000000,
        "firstName": "minney",
        "lastName": "2",
        "email": "mi.mouse@email.com",
        "classId": 1000000000000000001,
        applications
    },
    {
        "id": 1000000000000000000,
        "creationTime": 1000000000000,
        "modificationTime": 1000000000000,
        "firstName": "mortimer",
        "lastName": "3",
        "email": "morty@email.com",
        "classId": 1000000000000000001,
        applications
    },
];

module.exports.cacheData = [ 
    [ 
        { 
            key: '1000000000000000000/1',
            link: 'https://access.ravellosystems.com/simple/#/1000000000000000000/apps/1000000000' 
        },
        { 
            key: '1000000000000000000/2',
            link: 'https://access.ravellosystems.com/simple/#/1000000000000000000/apps/1000000000' 
        },
        { 
            key: '1000000000000000000/3',
            link: 'https://access.ravellosystems.com/simple/#/1000000000000000000/apps/1000000000' 
        } 
    ],
    [ 
        { 
            key: '1000000000000000000/1',
            link: 'https://access.ravellosystems.com/simple/#/1000000000000000000/apps/1000000000' 
        },
        { 
            key: '1000000000000000000/2',
            link: 'https://access.ravellosystems.com/simple/#/1000000000000000000/apps/1000000000' 
        },
        { 
            key: '1000000000000000000/3',
            link: 'https://access.ravellosystems.com/simple/#/1000000000000000000/apps/1000000000' 
        } 
    ] 
]
