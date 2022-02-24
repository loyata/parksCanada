const fs = require('fs');
let raw = fs.readFileSync("../PythonScripts/record.json");
let record = JSON.parse(raw);
const images = require('./images')['images'];
//console.log(record);

const mongoose = require('mongoose');
const Park = require("../models/park");

const envs = require("../env");


const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = envs.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

mongoose.connect(envs.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

let index = 0;
const seedDB = async () => {
    await Park.deleteMany({});//首先清空数据库
    for (let x in record) {

        let geoData = await geocoder.forwardGeocode({
        query: `${x}, ${record[x]['location']}`,
        limit: 1
        }).send();

        const park = new Park({
            author: "621159998cb1b207546ac1e4",
            location: `${x}, ${record[x]['location']}`,
            title: `${x} National Park`,
            images: [
                {url: images[index], title: "blank"}
                ],
            description: record[x]['description'],
            price: Math.floor(Math.random() * 1000) + 1234,
            geometry: geoData.body.features[0].geometry
        })
        await park.save();
        index += 1;
    }

}

seedDB().then(() => {
    mongoose.connection.close();
})