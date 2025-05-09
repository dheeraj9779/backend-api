const express = require('express');
const sharp = require('sharp');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const { v4: uuidv4 } = require('uuid');
const cloudinary = require('cloudinary').v2

//Using disk storage for image upload
const imageStorage = multer.diskStorage({
    // Destination to store image     
    destination: './images', 
      filename: (req, file, cb) => {
          cb(null, uuidv4() + '_' + file.fieldname 
             + path.extname(file.originalname))
    }
});


//I want to use memory storage for image upload
//const imageStorage = multer.memoryStorage();


const imageUpload = multer({
    storage: imageStorage,
    limits: {
      fileSize: 10000000 // 1000000 Bytes = 10 MB
    }

    // If want to use file filter which type of file we want to upload
    /* fileFilter(req, file, cb) {
      if (!file.originalname.match(/\.(png|jpg)$/)) { 
         // upload only png and jpg format
         return cb(new Error('Please upload a Image'))
       }
     cb(undefined, true)
     }*/
}) 

//We can also use like that
// const imageUpload = multer({dest: './image'})

//for multiple file upload
/*imageUpload.array('myFile',2) */ 
router.post("/", imageUpload.single('myFile'),async (req, res) => {
    try{
      cloudinary.v2.uploader.upload(req.file.path, {upload_preset: "my_preset"}, (error, result)=>{
        console.log(result, error);
      });
      //console.log("File upload successfully")
      const filePath = req.file.path;
      // Read the file from disk
      const fileBuffer = await fs.readFile(filePath);
      // Convert it in the jpg format using sharp
      const outputPath = path.join('images', `processed_${path.parse(req.file.filename).name}.jpg`);
      const convertedImageBuffer = await sharp(fileBuffer).toFormat('jpg').toFile(outputPath)
      //console.log("File processed successfully")
      res.send(convertedImageBuffer); 

       
    }
    catch(error){
        return res.status(401).json({message:error})
    }
})

module.exports = router