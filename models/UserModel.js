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
  profileImg: String,
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
  
},
{ timestamps: true }
);
userSchema.methods.generateHashedPassword = async function () {
  let salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
};
var UserModel = mongoose.model("UserModel", userSchema);

function validateSignup(data) {
  const schema = Joi.object({
    firstname: Joi.string().alphanum().min(5).max(30).required(),
    lastname: Joi.string().alphanum().min(5).max(30).required(),
    email: Joi.string().email({
      minDomainSegments: 2,
      tlds: { allow: ["com"] },
    }),
    password: Joi.string().min(7).max(20).required(),
    gender:Joi.string().required(),
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
function validatePassword(data) {
  const schema = Joi.object({
     newPassword: Joi.string().min(7).max(20).required()
  }).options({ allowUnknown: true });
  return schema.validate(data, { abortEarly: false });
}

function validateProfile(data) {
  const schema = Joi.object({
     profileImg: Joi.string().required().messages({'any.required': `"Profile Picture" is required`}),
     langPreference:Joi.string().required().messages({'any.required': `"Langugae" is required`})
     
  }).options({ allowUnknown: true }); 
  return schema.validate(data, { abortEarly: false });
}
module.exports.UserModel = UserModel;
module.exports.validateSignup = validateSignup; //for sign up
module.exports.validateLogin = validateLogin; // for login
module.exports.validatePassword=validatePassword;
module.exports.validateProfile =validateProfile