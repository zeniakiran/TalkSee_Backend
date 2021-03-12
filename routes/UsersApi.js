const express = require("express");
let router = express.Router();
let { UserModel } = require("../models/UserModel");
var bcrypt = require("bcryptjs");
//const _ = require("lodash");
const jwt = require("jsonwebtoken");
//const config = require("config");
const config = require("../config/keys");
/* const {
  signupValidation,
  loginValidation,

} = require("../middleware/validateUser"); */
const { signupVerificationController,activationController } = require("../controller/authUser");

router.get('/', async (req, res, next) => {
  try {
    let usersFromDb = await UserModel.find();
    if(!usersFromDb) 
        return res.send("There are currently no users");
        //res.json(productsFromDb.imgUrl)
    return res.send(usersFromDb);
}
catch(err){
    res.status(400).send(err);
 } 
});

router.get('/userbyemail/:email', async (req, res, next) => {
  try {
    let emailAdd = req.params.email;
    let userFromDb = await UserModel.find({
      email : emailAdd
    });
    if(!userFromDb) 
        return res.send("Some Error");
        //res.json(productsFromDb.imgUrl)
    return res.send(userFromDb);
}
catch(err){
    res.status(400).send(err);
 } 
});

router.post("/signup",signupVerificationController/* => {
  const { token } = req.body;
  //if(token) {
         jwt.verify(token, config.jwtPrivateKey, (err) => {
          if (err) {
            return res.status(401).json({
              errorMessage: 'Link expired, Signup again'
            });
          }}); 
        let user = await UserModel.findOne({ email: req.body.email });
        if (user) return res.status(400).send("User with given Email already exist");
        else{
        user = new UserModel();
        user.email = req.body.email;
        user.firstName = req.body.firstName;
        user.lastName = req.body.lastName;
        user.langPreference = req.body.langPreference;
        user.password = req.body.password;
        await user.generateHashedPassword();
        await user.save();
        let token = jwt.sign(
          { _id: user._id, firstName: user.firstName,lastName:user.lastName, role: user.role },
          config.jwtPrivateKey
        );
        return res.send(token);
        }
  //}
  else {
        return  res.status(400).json({
        errorMessage: 'Signup failed because no token identify'
        });
   }
  
  
} */);
router.post("/activation",activationController)
router.post("/login", async (req, res) => {
  let user = await UserModel.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("User Not Registered");
  let isValid = await bcrypt.compare(req.body.password, user.password);
  if (!isValid){
    return res.status(401).send("Invalid Password");
    
  } 
  let token = jwt.sign(
    { _id: user._id, firstName: user.firstName,lastName:user.lastName, role: user.role },
    config.jwtPrivateKey
  );
  res.send(token);
});
module.exports = router;
router.put("/forgot-password",forgotPasswordController);