var mongoose = require("mongoose");
const Joi = require('joi');

var userInfoSchema = mongoose.Schema({
    firstName : String,
    lastName : String,
    email : String,
    gender : String,
    langPreference : String
});

var UserInfo = mongoose.model("UserInfoModel", userInfoSchema);
module.exports.UserInfo= UserInfo;