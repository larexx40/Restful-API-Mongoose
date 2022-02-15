const express = require('express')
const bodyParser= require('body-parser')
const authenticate = require('../authenticate')
const multer = require('multer')
const uploadRouter = express.Router()

//declare where and how the file will be stored
const storage = multer.diskStorage({
    destination: (req, rfilees, cb)=>{
        cb(null, 'public/images')
    },
    filename:(req, file, cb)=>{
        cb(null, file.originalname)
    }
})

//decleare the type of file we allow
const imageFileFilter = (req, file, cb)=>{
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error('You can only upload image files!'), false)
    }
    cb(null, true)
}

//then upload by calling the 2 function
const upload = multer({storage: storage, fileFilter: imageFileFilter})


uploadRouter.use(bodyParser.json())
uploadRouter.route('/')
.get(authenticate.verifyUser, (req, res, next)=>{
    res.statusCode=403
    res.end('GET operation can not be supported on /imageUpload')
})

.post(authenticate.verifyUser, upload.single('imageFile'), (req, res, next)=>{
    res.statusCode=200
    res.setHeader('Conent-Type', 'application/json')
    res.json(req.file)
})

.put(authenticate.verifyUser, (req, res, next)=>{
    res.statusCode=403
    res.end('PUT operation can not be supported on /imageUpload')
})

.delete(authenticate.verifyUser, (req, res, next)=>{
    res.statusCode=403
    res.end('DELETE operation can not be supported on /imageUpload')
})

module.exports = uploadRouter