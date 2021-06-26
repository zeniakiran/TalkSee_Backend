const { validateSignup } = require("../models/SignUp");
const { validateLogin } = require("../models/SignUp");
function validateSignupUser(req, res, next) {
  let { error } = validateSignup(req.body);

  if (error) {
    const firstError = error.details[0].message;
    return res.status(400).json({
      errorMessage: firstError,
    });
  }
  next();
}
function validateLoginUser(req, res, next) {
  let { error } = validateLogin(req.body);

  if (error) {
    const firstError = error.details[0].message;
    return res.status(400).json({
      errorMessage: firstError,
    });
  }
  next();
}

module.exports.signupValidation = validateSignupUser;
module.exports.loginValidation = validateLoginUser;
