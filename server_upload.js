const express = require('express');
const multer  = require('multer');
const uuid = require('uuid').v4;   // module to generate unique ids for uploaded files

const filename = "file.txt";

const storage = multer.diskStorage({
    destination: (req,file, cb) => {
        cb(null, 'uploads');
    },
    filename: (req,file,cb) =>{
        cb(null, "file.txt");
        // cb(null, `${uuid()}-${originalname}`);
    }
});

const upload = multer({ storage });

const app = express();
app.use( express.static('./'));

app.post('/upload', upload.single('textFile'),(req, res) =>{
    // return res.json({status: 'OK'});
    res.redirect('index.html');
});
app.listen(3001, () => console.log('App is listening...'));
