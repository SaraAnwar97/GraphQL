const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const MONGODB_URI = 'mongodb+srv://Sara:Ss4923@@@cluster0.ldpfv.mongodb.net/Feed';
const app = express();
const multer = require('multer');

const fileStorage = multer.diskStorage({
  destination: (req,file,cb)  =>{
    cb(null, 'images'); // null: no error
  },
  filename: (req,file,cb) => {
    cb(null , new Date().toISOString() + '-' + file.originalname);
  }
});

const fileFilter = (req,file,cb) => {
  if(file.mimetype === 'image/png' || 
  file.mimetype === 'image/jpg' ||
   file.mimetype === 'image/jpeg' ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(bodyParser.json()); // application/json in header
app.use(multer({ storage: fileStorage , fileFilter: fileFilter }).single('image'));
app.use('/images',express.static(path.join(__dirname,'images')));
app.use((req,res,next)=>{
res.setHeader('Access-Control-Allow-Origin','*');
res.setHeader('Access-Control-Allow-Methods','GET,POST,PUT,PATCH,DELETE');
res.setHeader('Access-Control-Allow-Headers','Content-Type,Authorization');
next();
});

app.use((error,req,res,next)=>{
  console.log(error);
  const status = error.statusCode || 500 ;
  const message = error.message; //by default
  const data = error.data;
  res.status(status).json({message:message, data:data});
})
mongoose.connect(MONGODB_URI,{useNewUrlParser: true },{ useUnifiedTopology: true })
.then(result => {
 app.listen(8080);
})
.catch(err => {
  console.log(err);
}); 
