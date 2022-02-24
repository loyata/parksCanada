//todo cannot reference to stylesheets home/star

if(process.env.NODE_ENV !== "production"){
    require('dotenv').config();
}

const envs = require('./env');


// Connection with MongoAtlas
const mongoose = require('mongoose');
mongoose.connect(envs.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});


// express
const express = require('express');
const app = express();
app.use(express.urlencoded({extended:true}));// body parser

// helmet
const helmet = require("helmet");
// app.use(helmet());

// set view path
const path = require('path');
app.set('views', path.join(__dirname, 'views'))

// ejs
const ejsMate = require('ejs-mate');
app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');

// method-override
const methodOverride = require('method-override');
app.use(methodOverride('_method'));

// morgan, middleware for better log
const morgan  = require('morgan');
app.use(morgan('common'));

// Session & flash
const session = require('express-session');
const sessionConfig = {
    secret: 'this should be a better secret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig));
const flash = require('connect-flash')
app.use(flash());

// Passport
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user')
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



// a global middleware to store global information that will be processed by every ejs file
app.use((req, res, next) => {
    res.locals.currentUser = req.user;

    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

//routers
const parks = require('./routes/park')
app.use('/parks', parks)

const reviews = require('./routes/review')
app.use('/parks/:id/reviews', reviews)

const userRoutes = require('./routes/user');
app.use('/', userRoutes);

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/parks/:id/reviews',(req, res)=>{
    res.redirect(`/parks/${req.params.id}`);
})



const port = 3063
app.listen(port, () => {
    console.log(`Serving on port ${port}`);
})




