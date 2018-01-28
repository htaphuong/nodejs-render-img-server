const express = require('express');
const _ = require('lodash');
const path = require('path')
const multer = require('multer')

const lowdb = require('lowdb');     // supported for local JSON Database
const FileAsync = require('lowdb/adapters/FileAsync');  // Asynchronus adapter

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

const adapter = new FileAsync('db.json');
const db = (async connection => {
    const dbConnection = await connection;
    await dbConnection.defaults({ resource: [], users: [] }).write();
    return dbConnection;
})(lowdb(adapter));

// Upload image
const allowTypes = process.env.ALLOW_TYPE.split(',').map(type => type.trim());
const uploadConfig = {
    fields: process.env.MAX_FIELD || 19,
    files: process.env.MAX_FILE || 19,
    fileSize: (process.env.MAX_SIZE || 100) * 1048576,
    parts: process.env.MAX_PART || 19
};

const storage = multer.diskStorage({
    destination(req, file, cb) {
        var s = path.resolve(__dirname, 'public/resource'); 
        //console.log(Boolean(allowTypes.indexOf('ava01.png') > -1))
        //console.log('testttt')
        cb(null, `${path.resolve(__dirname, 'public/resource')}`);
    },
    
    filename(req, { originalname, mimetype }, cb) {
        // console.log({mimetype})
        // console.log(allowTypes)
        const nameSegments = originalname.split('.');
        const name = nameSegments[0] || `${Date.now()}`;

        const mineTypeSegments = mimetype.split('/');
        const ext = mineTypeSegments[1] || 'jpeg';
        cb(null, `${Date.now()}-${name}.${ext}`);
    }
});

const fileFilter = (req, { mimetype }, cb) => {
    //console.log({mimetype})
    //console.log(allowTypes)    
    cb(null, Boolean(allowTypes.indexOf(mimetype) > -1));
}

const uploader = multer({ storage, fileFilter, limits: uploadConfig });

app.post('/upload', uploader.array('iImages'), (req, res) => {
    //console.log(req)
    res.json({ images: req.files })
});
