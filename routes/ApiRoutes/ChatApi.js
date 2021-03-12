var express = require('express');
var router = express.Router();
//const validateProducts = require("../../Middlewares/validation");
var { Messages } = require("../../models/MessageModel");
//const auth = require("../../Middlewares/auth");
//const admin = require("../../Middlewares/admin");
var cors = require("cors")
const corsOptions = {
    origin: 'https://localhost:4000',
  }
router.get("/", async (req, res) => {
    try {
        let chatFromDb = await Messages.find();
        if(!chatFromDb) 
            return res.send("There are currently no Messages");
            //res.json(productsFromDb.imgUrl)
        return res.send(chatFromDb);
    }
    catch(err){
        res.status(400).send(err);
     } 
});

 router.get("/msgbyemail/:email",async (req, res) => {
    try {
        let emailAdd = req.params.email;
        let email = emailAdd.split(" ")
        let messageFromDb = await Messages.find({
            $or: [ { from: email[0],
                to : email[1]  }, { from: email[1],
                    to : email[0]  } ]
            /* from : email[0],
            to : email[1] */
        });
        if(!messageFromDb) 
            return res.send("No messages from current email"); 
        return res.send(messageFromDb); 
    }
    catch(err){
        res.status(400).send(err);
     } 
}); 
router.get("/msgbyuserid/:email",async (req, res) => {
    try {
        let emailAdd = req.params.email;
        let messageFromDb = await Messages.find({
             $or: [ { from: emailAdd},
                    {to : emailAdd} ] 
            /* from : email[0],
            to : email[1] */
            //from : emailAdd
        });
        if(!messageFromDb) 
            return res.send("No messages from current email"); 
        return res.send(messageFromDb); 
    }
    catch(err){
        res.status(400).send(err);
     } 
}); 

router.post("/",async (req,res)=>{
    let message= new Messages();
    message.from= req.body.from;
    message.to= req.body.to;
    message.roomId= req.body.roomId;
    message.messageBody = req.body.messageBody;
    message.time = req.body.time ;
    message.type = req.body.type;
    await message.save();
    return res.send("Message has been added to database successfully!");

});



module.exports =  router;