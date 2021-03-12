var mongoose = require("mongoose");
const Joi = require('joi');

var messagesSchema = mongoose.Schema({
    from : String,
    to : String,
    roomId : String,
    messageBody : String,
    time : {
        type : String,
        default : new Date().toLocaleString()
    },
    type: String
});

var Messages = mongoose.model("Messages", messagesSchema);
module.exports.Messages= Messages;