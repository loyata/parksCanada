const User = require("../models/user");
const { cloudinary } = require("../cloudinary");

module.exports.renderRegister = (req, res)=>{
    res.render('users/register');
}

module.exports.renderLogin = (req, res)=>{
    res.render('users/login');
}

module.exports.userRegister = async (req, res)=> {
    try {
    const {email, username, password} = req.body; // 1. get form info
    const user = new User({email, username});
    const registeredUser = await User.register(user, password)// 2. some cryptographic process from passport.js, saved to database already
    req.login(registeredUser, err => { //3. automatically login after registration
        if (err) return next(err);// ?
        req.flash('error', 'Something went wrong, please try again.');
        res.redirect('/parks');
    });
    }catch (err){
        // 4. handle error occurred during registration, for ex. already existed username
    }
}

module.exports.userLogin = (req, res)=>{
    req.flash('success', 'Welcome to Parks Canada');
    const redirectURL = req.session.returnTo || '/parks';
    delete req.session.returnTo;
    res.redirect(redirectURL);
}

module.exports.userLogout = (req, res)=>{
    req.logout();
    req.flash('success', 'Successfully logged out');
    res.redirect("/parks");
}