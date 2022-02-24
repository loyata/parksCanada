const mongoose = require('mongoose');
const Schema = mongoose.Schema; // Schema 的类型是function
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
})
UserSchema.plugin(passportLocalMongoose)// 为userSchema添加了用户名和密码的约束(field)以及对应的方法
module.exports = mongoose.model('User', UserSchema);