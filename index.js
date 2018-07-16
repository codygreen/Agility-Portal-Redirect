const express = require('express');
const RavelloClass = require('./ravelloClasses');

const app = express()

app.get('/', (req, res) => res.send('Agility 2018'))
app.get('/*', (req, res) => {
    const classes = new RavelloClass({
        domain: process.env.DOMAIN,
        password: process.env.PASSWORD,
        username: process.env.USERNAME,
    });

    classes.getCache(req.url.substring(1))
    .then((link) => {
        if(link === null) {
            res.send('Bad class and/or student ID');
        } else {
            res.redirect(link);
        }
    })
    .catch((err) => {
        throw err;
    });
})

app.listen(3000, () => console.log('Agility Portal Redirect listening on port 3000!'))
