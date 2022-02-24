
const Park = require("./models/park");
const Review = require("./models/review");

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        console.log(req.originalUrl);
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be logged in first');
        return res.redirect('/login');
    }
    next();
}

// A high-order function that a function accepts a function as an argument, and it also returns a function.
// wrapAsync will accept a function as a parameter, and its objective is to check if there are any errors in that function.
// If there arent, it will return the same function that was passed as an argument, and the code will be run normally;
// but if there's an error, it will catch the error, calling next() on it so it can be handled.
// it is a cleaner way to handle errors without writing try/catch, just pass the function to this wrapAsync function instead,
// and it will automatically just return the function if everything is fine, or return the error.

module.exports.wrapAsync = (fn)=>{
        return function (req, res, next){
        fn(req, res, next).catch(e => next(e));
    }
}

module.exports.isAuthor = async (req, res, next)=>{
    const {id} = req.params;
    const park = await Park.findById(id);
    if (!park.author.equals(req.user._id)){ // req.user来自passport的补充, 表示当前session的user以及id
        req.flash('error', 'You do not have permission to do that!');
        res.redirect(`/campgrounds/${id}`);
    }
    next();
}