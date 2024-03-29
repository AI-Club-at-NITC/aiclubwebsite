const express = require('express');
const router = express.Router();
const Photo = require('../model/gallerySchema');
const { InitFileUpload } = require('../file_upload');
const authenticate = require("../middleware/authenticate");

const fileUpload = InitFileUpload();

router.route('/getHomepagePhotos').get(async (req,res)=> {
    try {
        const somePhotos = await Photo.find({}).sort({createdAt:-1}).limit(8);
        res.status(200).json(somePhotos);
    } catch (error) {
        console.log(error);
        res.status(400).json({error:"error while getting photos"});
    }
});

router.route('/getAllPhotos').get(async (req,res)=>{
    try {
        const allPhtotos = await Photo.find({}).sort({createdAt:-1});
        res.status(200).send(allPhtotos);
    } catch (error) {
        console.log(error);
        res.status(500).json({"msg":"Problem with getting Photos"});
    }
});

router.route('/addPhoto').post(authenticate,async (req,res)=> {
    try {
        const photo = req.body;
        // console.log(photo);
        const newPhoto = new Photo(photo);
        await newPhoto.save();
        console.log(`Image uploaded sucessfully`);
        res.status(201).json({'msg':'photo added sucessfully'});
    } catch (error) {
        console.log(error);
        res.status(422).json({"msg":"Problem with adding Photo"});
    }
});

router.route('/deleteImages').delete(authenticate,async (req,res)=>{
    const urls = req.body.urls;
    // console.log("urls: ",req.body);

    const keys = urls.map((url)=>{
        return url.split('=')[2];
    })
    // console.log("keys: ",keys);
    try {
        const stats = keys.map(async (key)=>{
            return await fileUpload.deleteFile(key);
        })
    } catch (error) {
        console.log(error);
    }

    Photo.deleteMany({ imgurl: {$in:urls} }).then((result)=>{
        res.status(201).json({"msg":"Images deleted sucessfully"});
    }).catch((error)=>{
        res.status(500).json({error:"Error while deleting Images"})
    })
});

module.exports = router;