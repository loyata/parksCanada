const mongoose = require('mongoose');
const {func} = require("joi");
const Schema = mongoose.Schema;
const opts = {toJSON: {virtuals: true}};


const ImageSchema = new Schema({
    url: String,
    filename:String
});
// to replace image_url to thumbnail version
ImageSchema.virtual('thumbnail').get(()=>{
    this.url.replace("/upload","/upload/w_200")
})

const ParkSchema = new Schema({
    title: {
        type:String
    },
    price: String,
    description: String,
    location: String,
    images: [ImageSchema],
    geometry:{
        type:{
            type: String,
            enum:['Point'],
            //required:true
        },
        coordinates:{
            type:[Number],
            //required: true
        }
    },
    author: {
        type: Schema.Types.ObjectId,
        ref:'User'
    },
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:'Review'
        }
    ],

}, opts);

ParkSchema.virtual('properties.popUpMarkup').get(function(){
    return `<a href="/parks/${this.id}">${this.title}</a>`;
})



const Park = mongoose.model('Park', ParkSchema);
module.exports = Park;




