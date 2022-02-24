CLOUDINARY_CLOUD_NAME = "uottawa-yd"
CLOUDINARY_KEY = "424156525175318"
CLOUDINARY_SECRET = "zcAJ8cG6xludhgc1wAf-11V7rKA"



const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_KEY,
    api_secret: CLOUDINARY_SECRET
});



const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'ParksCanada',
        allowedFormats: ['jpeg', 'png', 'jpg', 'arw', 'cr2', 'cr3', 'nef']
    }
});

module.exports = {
    cloudinary,
    storage
}