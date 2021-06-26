const { Signup } = require("../models/SignUp");
const bcrypt = require("bcryptjs");
const _ = require("lodash");
const jwt = require("jsonwebtoken");
const sgMail = require('@sendgrid/mail');
const config = require("config");
sgMail.setApiKey("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")
exports.signupVerificationController = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const emailAlready = await Signup.findOne({ email });
    if (emailAlready) {
      return res.status(400).json({
        errorMessage: "Email Already exists",
      });
    }
     const token = jwt.sign(
      {
        username,
        email,
        password
      },
      config.get("jwtPrivateKey"),
      {
        expiresIn: '8m'
      }
    );
    const emailData = {
      from: "fa17-bcs-015@cuilahore.edu.pk",
      to: "farihaliaqat31@gmail.com",
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
                    <p><i>Hey <strong>${username}</strong>, To become a member of TalkSee family let's verify your account by clicking below button. Once it's done you will be able to register your account</i></p>
                    <a class ="link" href="http://localhost:3000/user/activate/${token}" >Verify my email</a>
                    <hr />
                    </div>
               </body>
                `
    };
   sgMail.send(emailData)
      .then(sent => {
        res.status(200).json({
      successMessage: "Check your gmail account to verify your account",
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
  jwt.verify(token, config.get("jwtPrivateKey"), (err) => {
      if (err) {
        return res.status(401).json({
          errorMessage: 'Link expired, Signup again'
        });
      }  });
     const { username, email, password } = jwt.decode(token);
  try{
    const emailAlready = await Signup.findOne({ email });
    if (emailAlready) {
      return res.status(400).json({
        errorMessage: "Email Already taken",
      });
    }
     const newUser = new Signup();
    newUser.username = username;
    newUser.email = email;
    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(password, salt);
      
    await newUser.save();
     res.status(200).json({
      successMessage: "Successfully Registered",
    });
  }catch (err) {
    res.status(400).json({
      errorMessage: "Failed to register your account",
    });
  }
   
     } else {
   return  res.status(400).json({
              errorMessage: 'Signup failed because no token identify'
            });
  }

}
exports.loginController = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await Signup.findOne({ email });
    if (!user) {
      return res.status(400).json({
        errorMessage: "User not registered",
      });
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        errorMessage: "Invalid password",
      });
    }
    const payload = {
      user: {
        _id: user._id,
      },
    };
    jwt.sign(payload, config.get("jwtPrivateKey"), (err, token) => {
      if (err) console.log("JWT error");
      const { _id, username, email, role } = user;
      res.json({
        token,
        user: { _id, username, email, role },
      });
    });
   } catch (err) {
    res.status(500).json({
      errorMessage: "Server Error in Controller",
    });
  }

};
