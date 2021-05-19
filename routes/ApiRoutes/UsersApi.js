const express = require("express");
let router = express.Router();
let { UserModel } = require("../../models/UserModel");
var bcrypt = require("bcryptjs");
//const _ = require("lodash");
const jwt = require("jsonwebtoken");
const config = require("../../config/keys");
const {
  signupValidation,
  loginValidation,
  resetPasswordValidation,
  profileSetupValidation,
  

} = require("../../middlewares/validateUser")
const { signupVerificationController,activationController,resetPasswordController, 
        forgotPasswordController , profileSetupController, loginController,
        updateProfileSetupController,getMyAccountController } = 
        require("../../controller/authUser");

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

router.post('/userbyemail', async (req, res, next) => {
  try {
    const  users  = req.body.userArray;
    //console.log("user:",req.body)
    if(users){
    //console.log(users)
    const emails= []
     //users.forEach(function (item) {
         // emails.push(item.email);
        //});
   const usersArr = await UserModel.find({ email: { $in: users} });
   let user = []
   usersArr.map((u)=>{
      user.push({email : u.email, name : u.firstName +" "+
      u.lastName, id : u._id, img:u.profileImg, lang: u.langPreference,gender: u.gender})
      
   })
   console.log(user);
    return res.status(200).send(user);
  }
  else{
    const us = req.body.userEmail
    //console.log("us",us)
    const user = await UserModel.find({email : us});
    if(!user)
      return res.status(400).send("User not found!")
    return res.status(200).send(user)
  }
}

    catch (err) 
          {console.error(err.message);}
          
  /* try {
    let emailAdd = req.params.email;
    console.log("email",emailAdd)
    let  userFromDb = await UserModel.find({
      email : emailAdd
    });
    if(!userFromDb) 
        return res.send("Some Error");
        //res.json(productsFromDb.imgUrl)
    return res.send(userFromDb);
}
catch(err){
    res.status(400).send(err);
 }  */
});

router.post("/signup",signupVerificationController
  /*async(req, res) => {
  const { token } = req.body;
  //if(token) {
        
        let user = await UserModel.findOne({ email: req.body.email });
        if (user) return res.status(400).send("User with given Email already exist");
        else{
        user = new UserModel();
        user.email = req.body.email;
        user.firstName = req.body.firstName;
        user.lastName = req.body.lastName;
        user.langPreference = req.body.langPreference;
        user.profilePicture = req.body.profilePicture;
        user.password = req.body.password;
        await user.generateHashedPassword();
        await user.save();
        let token = jwt.sign(
          { _id: user._id},
          config.jwtPrivateKey
        );
        return res.send(token);
        }
  //}
  /* else {
        return  res.status(400).json({
        errorMessage: 'Signup failed because no token identify'
        });
   } 
  
  
}*/ );
router.post("/activation",activationController)
router.post("/login",loginController /* async (req, res) => {
  try{
    let user = await UserModel.findOne({ email: req.body.email });
    if (!user) return res.status(400).send("User Not Registered");
    let isValid = await bcrypt.compare(req.body.password, user.password);
    if (!isValid){
      return res.status(401).send("Invalid Password");
      
    } 
    let token = jwt.sign(
      { _id: user._id},
      config.jwtPrivateKey
    );
    res.send(token);
  }
  catch(err){
    console.log(err)
  }
} */);
router.put("/forgot-password",forgotPasswordController);
router.put("/reset-password",resetPasswordValidation,resetPasswordController);
router.post("/profile-setup" ,profileSetupValidation,profileSetupController)
router.get("/my-account/:id"  ,getMyAccountController);
router.put("/update-profile-setup/:id",updateProfileSetupController)
module.exports = router;
//router.put("/forgot-password",forgotPasswordController);