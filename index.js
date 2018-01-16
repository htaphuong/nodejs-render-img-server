const express = require('express');
const _ = require('lodash');
const path = require('path')
const multer = require('multer')

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

// Upload image
const allowTypes = ['image/png', 'image/jpeg', 'image/gif'];
const uploadConfig = {
    fields: 17,
    files: 17,
    fileSize: 100 * 1048576,
    parts: 17
};

const storage = multer.diskStorage({
    destination(req, file, cb) {
        var s = path.resolve(__dirname, 'public/resource'); 
        //console.log(Boolean(allowTypes.indexOf('ava01.png') > -1))
        //console.log('testttt')
        cb(null, `${path.resolve(__dirname, 'public/resource')}`);
    },
    
    filename(req, { originalname, mimetype }, cb) {
        //console.log({mimetype})
        const nameSegments = originalname.split('.');
        const name = nameSegments[0] || `${Date.now()}`;

        const mineTypeSegments = mimetype.split('/');
        const ext = mineTypeSegments[1] || 'jpeg';
        cb(null, `${Date.now()}-${name}.${ext}`);
    }
});

const fileFilter = (req, { mimetype }, cb) => {
    //console.log({mimetype})
    cb(null, Boolean(allowTypes.indexOf(mimetype) > -1));
}

const uploader = multer({ storage, fileFilter, limits: uploadConfig });

app.post('/upload', uploader.array('iImages'), (req, res) => {
    //console.log(req)
    res.json({ images: req.files })
}
);
