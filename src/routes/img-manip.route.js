const express = require('express');
const sharp = require('sharp');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const { v4: uuidv4 } = require('uuid');
const cloudinary = require('cloudinary').v2


// (async function() {

//     // Configuration
//     cloudinary.config({ 
//         cloud_name: 'dxu6h32zq', 
//         api_key: '888753991876936', 
//         api_secret: '<your_api_secret>' // Click 'View API Keys' above to copy your API secret
//     });
    
//     // Upload an image
//      const uploadResult = await cloudinary.uploader
//        .upload(
//            'https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg', {
//                public_id: 'shoes',
//            }
//        )
//        .catch((error) => {
//            console.log(error);
//        });
    
//     console.log(uploadResult);
    
//     // Optimize delivery by resizing and applying auto-format and auto-quality
//     const optimizeUrl = cloudinary.url('shoes', {
//         fetch_format: 'auto',
//         quality: 'auto'
//     });
    
//     console.log(optimizeUrl);
    
//     // Transform the image: auto-crop to square aspect_ratio
//     const autoCropUrl = cloudinary.url('shoes', {
//         crop: 'auto',
//         gravity: 'auto',
//         width: 500,
//         height: 500,
//     });
    
//     console.log(autoCropUrl);    
// })();

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

cloudinary.config({
  cloud_name: 'dxu6h32zq',
  api_key:'888753991876936',
  api_secret: 'u9iPvYQu9lrt0lV4OYstHXmV0Qg'
})

router.post("/", imageUpload.single('myFile'),async (req, res) => {
    try{

      cloudinary.uploader.upload(req.file.path, (error, result)=>{
        console.log(result, error);
        res.send('Uploaded success')
      });

      
      console.log("File upload successfully")
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