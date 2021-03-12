const express = require("express");
const router = express.Router();
const {
  signupValidation,
  loginValidation,

} = require("../middleware/validateUser");
const { activationController, loginController,signupVerificationController } = require("../controller/authUser");

router.post("/signup", signupValidation, signupVerificationController);
router.post("/activation",activationController)
router.post("/login", loginValidation, loginController);

module.exports = router;
