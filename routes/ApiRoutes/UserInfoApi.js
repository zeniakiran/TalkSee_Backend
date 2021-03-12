var express = require('express');
var router = express.Router();
//const validateProducts = require("../../Middlewares/validation");
var { UserInfoModel } = require("../../models/UserInfoModel");
//const auth = require("../../Middlewares/auth");
//const admin = require("../../Middlewares/admin");


router.get("/", async (req, res) => {
    try {
        let usersFromDb = await UserInfoModel.find();
        if(!usersFromDb) 
            return res.send("There are currently no users");
            //res.json(productsFromDb.imgUrl)
        return res.send(usersFromDb);
    }
    catch(err){
        res.status(400).send(err);
     } 
});



router.get("/msgbyemail/:email",async (req, res) => {
    try {
        let email = req.params.email;
        /*  let messageFromDb = await UserInfoModel.find({
            email : email,
        });
        if(!messageFromDb) 
            return res.send("No messages from current email"); */
        return res.send(email); 
    }
    catch(err){
        res.status(400).send(err);
     } 
});


module.exports =  router;