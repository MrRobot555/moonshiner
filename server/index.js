const express = require('express');
const cors = require('cors');
const path = require('path');
const crypto = require('crypto');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const methodOverride = require('method-override');
const mongoose = require('mongoose');

const app = express();

//Middleware

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

app.use(cors());
app.use(methodOverride('_method'));


//Mongo URI
const mongoURI = 'mongodb+srv://myuser:aTHHPcMGLbrHpo2i@hotdeals.ae9hs.mongodb.net/hotdeals?retryWrites=true&w=majority';

//Mongo connection
const conn = mongoose.createConnection(mongoURI);

//Init gfs
let gfs;

conn.once('open', () => {
  // Init stream
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('uploads');
});

//Create storage engine

const storage = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: 'uploads',
          myid : 4729492492
        };
        resolve(fileInfo);
      });
    });
  }
});
const upload = multer({ storage });

//upload image
app.post('/upload', upload.single('file'), (req, res) => {
    res.json({file: req.file});
});


const deals = require('./routes/api/deals');

app.use('/api/deals', deals);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));

