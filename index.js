const express = require('express');
const bodyParser = require("body-parser");
const RavelloClass = require('./ravelloClasses');

const app = express();

app.set('view engine', 'pug');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => res.render('index', { 
    title: 'Agility 2018 Labs', 
    message: 'Welcome to the Agility 2018 Labs.',
    instructions: 'Enter your class number and your student number.' 
}));

app.post('/redirect', (req, res) => {
    const classes = new RavelloClass({
        domain: process.env.DOMAIN,
        password: process.env.PASSWORD,
        username: process.env.USERNAME,
    });

    classes.getCache(`${req.body.class}/${req.body.student}`)
    .then((link) => {
        if(link === null) {
            res.render('index', { 
                title: 'Agility 2018 Labs', 
                message: 'Welcome to the Agility 2018 Labs.',
                instructions: 'Enter your class number and your student number.',
                error: 'Bad class and/or student ID'
            });
        } else {
            res.redirect(link);
        }
    })
    .catch((err) => {
        res.status(500).send({status:500, message: err, type:'internal'}); 
    });
})

app.get(`/${process.env.DOMAIN}/update`, (req, res) => {
// app.get(`/test/update`, (req, res) => {
    const classes = new RavelloClass({
        domain: process.env.DOMAIN,
        password: process.env.PASSWORD,
        username: process.env.USERNAME,
    });

    classes.processClasses()
    .then((results) => {
        res.send(results);
    })
    .catch((err) => {
        console.log('PROCESSCLASSES ERROR: ' + err);
        res.status(500).send({status:500, message: err, type:'internal'}); 
    })
});
app.get('/*', (req, res) => {
    const classes = new RavelloClass({
        domain: process.env.DOMAIN,
        password: process.env.PASSWORD,
        username: process.env.USERNAME,
    });

    classes.getCache(req.url.substring(1))
    .then((link) => {
        if(link === null) {
            res.render('index', { 
                title: 'Agility 2018 Labs', 
                message: 'Welcome to the Agility 2018 Labs.',
                instructions: 'Enter your class number and your student number.',
                error: 'Bad class and/or student ID'
            });
        } else {
            res.redirect(link);
        }
    })
    .catch((err) => {
        res.status(500).send({status:500, message: err, type:'internal'}); 
    });
});

app.listen(3000, () => console.log('Agility Portal Redirect listening on port 3000!'))
