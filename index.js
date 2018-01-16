const express = require('express');
const _ = require('lodash');

const app = express();

// Routes 
const package = require('./package.json');

// Root 
app.get('/', (req, res) =>
    res.json(
        _.pick(package, ['name', 'version', 'description','authors','license'])
    )
);

const port = process.env.PORT || 9999;
app.listen(port);