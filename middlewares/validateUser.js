const { validateSignup, validateLogin, validatePassword, validateProfile} = require("../models/UserModel");
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
function validateResetPassword(req, res, next) {
  let { error } = validatePassword(req.body);

  if (error) {
    const firstError = error.details[0].message;
    return res.status(400).json({
      errorMessage: firstError,
    });
  }
  next();
}
function validateProfileSetup(req, res, next) {
  let { error } = validateProfile(req.body);

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
module.exports.resetPasswordValidation=validateResetPassword;
module.exports.profileSetupValidation=validateProfileSetup;