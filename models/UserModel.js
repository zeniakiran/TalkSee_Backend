var mongoose = require("mongoose");
var bcrypt = require("bcryptjs");
const Joi = require("joi");
var userSchema = mongoose.Schema({
  email: { type: String,
    trim: true,
    unique:true,
    lowercase:true,
    },
  firstName: String,
  lastName: String,
  langPreference : String,
  password: String,
  role: {
    type: Number,
    default: 0,
  },
  gender:String,
  resetPasswordLink: {
      data: String,
      default: ''
    }
});
userSchema.methods.generateHashedPassword = async function () {
  let salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
};
var UserModel = mongoose.model("UserModel", userSchema);

function validateSignup(data) {
  const schema = Joi.object({
    email: Joi.string().email({
      minDomainSegments: 2,
      tlds: { allow: ["com"] },
    }),
    firstName: Joi.string().alphanum().min(5).max(30).required(),
    lastName: Joi.string().alphanum().min(5).max(30).required(),
    password: Joi.string().min(7).max(20).required(),
  });
  return schema.validate(data, { abortEarly: false });
}
function validateLogin(data) {
  const schema = Joi.object({
    email: Joi.string().email({
      minDomainSegments: 2,
      tlds: { allow: ["com"] },
    }),

    password: Joi.string().required(),
  });
  return schema.validate(data, { abortEarly: false });
}

module.exports.UserModel = UserModel;
module.exports.validateSignup = validateSignup; //for sign up
module.exports.validateLogin = validateLogin; // for login