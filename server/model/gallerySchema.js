const mongoose = require('mongoose');
const { Schema } = mongoose;

const gallerySchema =new Schema({
    imgurl:{
        type:String,
        required:true
    },
    caption:{
        type:String,
        required:true
    },
    width:{
        type:Number,
        required:true
    },
    height:{
        type:Number,
        required:true
    },
},{ timestamps: true });

const Photo = mongoose.model('photo',gallerySchema);
module.exports = Photo;



