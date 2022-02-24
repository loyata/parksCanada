const Review = require("../models/review");
const Park = require("../models/park");

const reviews = require("../controllers/review");

const express = require("express");
const {isLoggedIn} = require("../middleware");
const router = express.Router({mergeParams: true});// very important!!!!!


router.post('/', isLoggedIn, reviews.createReview);
router.delete('/:reviewID', reviews.deleteReview);


module.exports = router;