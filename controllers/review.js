const Review = require("../models/review");
const Park = require("../models/park");

module.exports.createReview = async (req, res)=>{
    const id = req.baseUrl.replace('/parks/','').replace('/reviews','');
    const park = await Park.findById(id);
    const review = new Review(req.body.review);// review = {rating:xxx, body:xxx}
    review.author = req.user._id;
    // if(!park.reviews){
    //     park.reviews = {};
    // }
    park.reviews.push(review);
    await review.save();
    await park.save();
    req.flash('success', 'Successfully created a new review!')
    res.redirect(`/parks/${id}`);
}

module.exports.deleteReview = async (req, res)=>{
    console.log(req.params);
    const {id, reviewID} = req.params;
    Park.findByIdAndUpdate(id, {$pull:{reviews: reviewID}});
    await Review.findByIdAndDelete(reviewID);
    req.flash('success', 'Successfully deleted a review!')
    res.redirect(`/parks/${id}`);
}