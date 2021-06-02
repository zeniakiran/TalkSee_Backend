const { UserModel } = require("../models/UserModel");
const bcrypt = require("bcryptjs");
const _ = require("lodash");
const jwt = require("jsonwebtoken");
 const config = require("../config/keys");
const nodemailer = require('nodemailer');
require('dotenv').config();
exports.signupVerificationController = async (req, res) => {
  const { email,firstName, lastName, password,gender } = req.body;
  try {
    const emailAlready = await UserModel.findOne({ email });
    if (emailAlready) {
      return res.status(400).json({
        errorMessage: "Email Already exists",
      });
    }
     const token = jwt.sign(
      {
        email,
        firstName,
        lastName,
        password,
        gender
      },
      config.jwtPrivateKey,
      {
        expiresIn: '10m'
      }
    );
    let transporter = nodemailer.createTransport({
      service: 'gmail',
     auth:{
       user:process.env.EMAIL,
       pass:process.env.PASSWORD
     },
      tls: {
         rejectUnauthorized: false
     }
   })
    const emailData = {
      from: process.env.EMAIL,
      to: email,
      subject: 'Account activation link',
      html: ` <head>
             <style>    
              .card {
                    box-shadow: 0 4px 8px 0 rgba(144,171,188,0.2);
                    transition: 0.3s;
                    text-align: center;
                    }
               h1{
                 color: rgb(161, 136, 127);
                  font-family: Brush Script MT, Brush Script Std, cursive
               }
                .link {
                       background-color: #0ABBD8;
                      color: white !important;
                      padding: 10px 25px;
                      text-align: center;
                      text-decoration: none;
                      display: inline-block;
                      border-radius: 14px;
                     }

               a:hover, a:active {
                      background-color: #8dadaf;
                      color: white;
  
                     }
                     p {
                       color : #797D7F;
                       text-align: center;
                     }
                     h2{
                       color:black;
                     }
               </style>
              </head>
              <body>
                    <div class="card">
                    <h1>TalkSee</h1>
                    <h2>Verify Email Address</h2> 
                    <p><i>Hey <strong>${firstName+" "+lastName}</strong>, To become a member of TalkSee family let's verify your account by clicking below button. Once it's done you will be able to register your account</i></p>
                    <a class ="link" href="http://localhost:4000/user/activate/${token}" >Verify my email</a>
                    <hr />
                    </div>
               </body>
                `
    };
    transporter.sendMail(emailData)
      .then(sent => {
        res.status(200).json({
      successMessage: `Email has been sent to ${email}`,
    });
      })
      .catch(err => {
       res.status(500).json({
      errorMessage: "Sendgrid Error",
    });
     
  });
    
     
  } catch (err) {
    res.status(500).json({
      errorMessage: "Server Error",
    });
  }
};
 exports.activationController = async (req, res) => {
  const { token } = req.body;
  if(token) {
  jwt.verify(token, config.jwtPrivateKey, (err) => {
      if (err) {
        return res.status(401).json({
          errorMessage: 'Link expired, Signup again'
        });
      }});
      const { email,firstName,lastName, password,gender } = jwt.decode(token);
  try{
    const emailAlready = await UserModel.findOne({ email });
    if (emailAlready) {
      return res.status(400).json({
        errorMessage: "Email Already taken",
        firstname:firstName,
        lastname:lastName
      });
    }
     const newUser = new UserModel();
    newUser.firstName = firstName;
    newUser.lastName = lastName;
    newUser.email = email;
    newUser.gender =gender;
    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(password, salt);
      
    await newUser.save();
     res.status(200).json({
      successMessage: "Successfully Registered",
      firstName:firstName,
      lastName:lastName
    });
  }catch (err) {
    res.status(400).json({
      errorMessage: "Failed to register your account",
      firstName:firstName,
      lastName:lastName
    });
  }
   
     } else {
   return  res.status(400).json({
              errorMessage: 'Signup failed because no token identify',
              firstName:firstName,
              lastName:lastName
            });
  }

}
exports.loginController = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({
        errorMessage: "Account not registered",
      });
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        errorMessage: "Invalid password",
      });
    }
    const payload = {
      user: { _id: user._id, },
     };
    jwt.sign(payload, config.jwtPrivateKey, (err, token) => {
      if (err) console.log("JWT sign error in Login");
      const { _id, firstName,lastName, email, role,gender, profileImg,langPreference, friends, sentRequests,friendRequests } = user;
      console.log(firstName)
      return  res.json({
        token,
        user: { _id, firstName,lastName, email, role ,gender, profileImg,langPreference, friends, sentRequests,friendRequests,  },
      });
    });
   } catch (err) {
     return res.status(500).json({
      errorMessage: "Server Error in Login Controller"
      
    });
    
  }

};
exports.forgotPasswordController = async (req, res) => {
  const { email } = req.body;
   try{
      const user = await UserModel.findOne({ email });
     if (!user) {
       return res.status(400).json({
         errorMessage: "User not found. Please Signup",
       });
     }
  else{
  const payload = {
       user: {
         _id: user._id,
       },
     };
     const token = jwt.sign(
       payload,config.jwtResetKey,{expiresIn: '10m'}
     );
      let transporter = nodemailer.createTransport({
        service: 'gmail',
       auth:{
         user:process.env.EMAIL,
         pass:process.env.PASSWORD
       },
        tls: {
           rejectUnauthorized: false
       }
     })
       const emailData = {
       from: process.env.EMAIL,
       to: email,
       subject: 'Password Reset link',
       html: ` <head>
              <style>    
               .card {
                     box-shadow: 0 4px 8px 0 rgba(144,171,188,0.2);
                     transition: 0.3s;
                     text-align: center;
                     }
                h1{
                  color: rgb(161, 136, 127);
                   font-family: Brush Script MT, Brush Script Std, cursive
                }
               p {
                        color : #797D7F;
                        text-align: center;
                      }
                      h2{
                        color:black;
                      }
                </style>
               </head>
               <body>
                     <div class="card">
                     <h1>TalkSee</h1>
                     <h2>Click below link to reset your password</h2> 
                     <p>http://localhost:4000/reset-password/${token}</p>
                     <hr />
                     </div>
                </body>
                 `
     };
         return user.updateOne(
           {
             resetPasswordLink: token
           },
           (err) => {
             if (err) {
               return res.status(400).json({
                 errorMessage:
                   'Database connection error on user password forgot request'
               });
             } else {
                transporter.sendMail(emailData)
                 .then(sent => {
                   return res.json({
                     successMessage: `Email has been sent to ${email}`
                   });
                 })
                 .catch(err => {
                    res.status(500).json({
                    errorMessage: "Error in email sent FP",
                    });
                 });
             }
           }
         );
 
   }
 }
   catch (err) {
     return res.status(500).json({
       errorMessage: "Server Error in FP Controller",
     });
   }
 };

 exports.resetPasswordController = async (req, res) => {
  const { resetPasswordLink, newPassword } = req.body;

try {
    if (resetPasswordLink) {
      jwt.verify(resetPasswordLink, config.jwtResetKey, (err) => {
      if (err) {
        return res.status(401).json({
          errorMessage: 'Reset Password Link expired, Try again',
        });
      } });
    
          let user = await UserModel.findOne({resetPasswordLink});
           if(user){
              const salt = await bcrypt.genSalt(10);
              user.password = await bcrypt.hash(newPassword, salt);
              user.resetPasswordLink='';
              await user.save();
               return res.status(200).json({
            successMessage: "Password successfully updated",
    });
           }
           else{
                return  res.status(500).json({
                errorMessage: "Your password is already updated.Please login",
           });
           }
      
    }
  } catch (err) {
    console.log(err)
    res.status(500).json({
      errorMessage: "Link is not recognized",
    });
  }
};
exports.profileSetupController = async (req, res) => {
  const {profileImg, langPreference, token}= req.body;
  try{
   const{email} = jwt.decode(token);
   console.log(langPreference);
    let user = await UserModel.findOne({email});
    if(user){
    user.profileImg=profileImg;
    user.langPreference=langPreference;
     await user.save();
               return res.status(200).json({
            successMessage: "Profile has been created",
    });
  }
  else{
                return  res.status(500).json({
                errorMessage: "profile not set",
           });
           }
  }
  catch (err) {
    console.log(err)
    res.status(500).json({
      errorMessage: "Error in Profile Controller",
    });
  }
}
exports.getMyAccountController = async (req, res) => {
  try {
   let user = await UserModel.findById(req.params.id);
   if (!user)
     return res.status(400).json({
       errorMessage: "User with that ID not found",
     });
   return res.send(user);
 } catch (err) {
   return res.status(400).json({
     errorMessage: "Invalid ID",
   });
 }
}
exports.updateProfileSetupController = async (req, res) => {
  try {
    let user = await UserModel.findById(req.params.id);
    user.profileImg = req.body.profileImg;
    user.langPreference=req.body.langPreference;
    
  const friendReq = await UserModel.updateMany(
    {"friendRequests":{$elemMatch:{id:req.params.id}}} ,
  {$set:{'friendRequests.$.langPreference':req.body.langPreference,
  'friendRequests.$.profileImg':req.body.profileImg
}}
  );
  const friends = await UserModel.updateMany(
    {"friends":{$elemMatch:{id:req.params.id}}} ,
  {$set:{'friends.$.langPreference':req.body.langPreference,
'friends.$.profileImg':req.body.profileImg}}
  );
await user.save(); 
  return res.status(200).json({
      successMessage: "Profile has been successfully Updated",
      userData:user
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      errorMessage: "Failed to Update Profile",
    });
  }
}
exports.deleteMyAccountController  = async (req, res) => {
   try {
   await UserModel.findByIdAndDelete(req.params.id)
     await UserModel.updateMany(
    {"friends":{$elemMatch:{id:req.params.id}}} ,
  {$pull:{'friends':{"id":req.params.id}}}
  );
   
   await UserModel.updateMany(
    {"friendRequests":{$elemMatch:{id:req.params.id}}} ,
  {$pull:{'friendRequests':{"id":req.params.id}}}
  );
     return res.status(200).json({
      successMessage: "Your Account has been deleted",
    });
  }catch (error) {
    console.log(error);
    return res.status(400).json({
      errorMessage: "Failed to Delete your Account",
    });
  }

}