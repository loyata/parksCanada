const envs = require("../env");

const Park = require("../models/park");
require("../models/review") //if use populate, then they must be included
require("../models/user")
const { cloudinary } = require("../cloudinary");


const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = envs.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

module.exports.index = async (req, res)=>{
    const parks = await Park.find({});
    //console.log({features: JSON.stringify(parks)});
    res.render('parks/index',{parks});
}

module.exports.renderNewForm = (req, res)=>{
    res.render('parks/new');
}

module.exports.createNewPark = async (req, res) => {
    // 关于form中name的写法, 如果各个park[price/title/description] 那么req.body里会有一个object名为park专门存这些
    // 如果直接写名字, 那么直接存在req.body这个object内
    //console.log(req.body);
    const geoData = await geocoder.forwardGeocode({
        query: req.body.park.location,
        limit: 1
    }).send();

    const park = new Park(req.body.park);
    park.geometry = geoData.body.features[0].geometry;
    park.images = req.files.map(f=>({url:f.path, filename: f.filename}));
    park.author = req.user._id;
    await park.save();
    req.flash('success', "Successfully made a new post!");
    res.redirect(`/parks/${park._id}`);
}


module.exports.showPark = async (req, res)=>{
    const{id} = req.params;
    // nested populate
    const park = await Park.findById(id)
        .populate(
        {
            path:'reviews',
            populate:{
                path:'author'
            }
        } // nested populate, populate reviews of park, then author of each review
     )
        .populate('author');//populate author of current park
    if(!park){
        req.flash('message','message');
        res.redirect('/parks');
    }
    res.render('parks/show',{park});
}

module.exports.renderEditForm = async (req, res)=>{
    const {id} = req.params;
    const park = await Park.findById(id);
    if(!park){
        req.flash('error', 'Cannot find a post')
        return res.redirect('/parks')
    }
    res.render('parks/edit', {park});
}

module.exports.updatePark = async (req, res)=>{
    const{id} = req.params;
    const park = await Park.findByIdAndUpdate(id, {...req.body.park});
    const images = req.files.map(f => ({url: f.path, filename: f.filename}));
    park.images.push(...images);
    await park.save();
    if (req.body.deleteImages){
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await park.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } });
    }
    if (!park.author.equals(req.user._id)){ // req.user来自passport的补充, 表示当前session的user以及id
        req.flash('error', 'You do not have permission to do that!');
        res.redirect(`/parks/${id}`);
    }
    res.redirect('/parks');
}

module.exports.destroyPark = async (req,res)=>{
    await Park.findByIdAndDelete(req.params.id);
    res.redirect('/parks');
}