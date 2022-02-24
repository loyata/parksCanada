const express = require('express');
const router = express.Router();
const {isLoggedIn, wrapAsync, isAuthor} = require('../middleware');
;
const {storage} = require("../cloudinary");
const multer = require('multer');
const upload = multer({storage});

const parks = require("../controllers/park");

router.route('/')
    .get(wrapAsync(parks.index))
    .post(isLoggedIn, upload.array('image'),wrapAsync(parks.createNewPark));

router.route('/new')
    .get(isLoggedIn, parks.renderNewForm);

// there will be error if this is put ahead
router.route('/:id')
    .get(wrapAsync(parks.showPark))
    .put(isLoggedIn,isAuthor,upload.array('image'), parks.updatePark)
    .delete(isLoggedIn, wrapAsync(parks.destroyPark));

router.route('/:id/edit')
    .get(isLoggedIn, isAuthor, wrapAsync(parks.renderEditForm));




module.exports = router;