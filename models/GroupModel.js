var mongoose = require("mongoose");
const Joi = require('joi');

var groupSchema = mongoose.Schema({
    groupName : String,
    groupId : String,
    createdBy : String,
    groupMembers : [String]
});

var Group = mongoose.model("GroupModel", groupSchema);
module.exports.Group= Group;