require('dotenv').config();
var express = require('express');
var router = express.Router();
//const validateProducts = require("../../Middlewares/validation");
var { Messages } = require("../../models/MessageModel");
//const auth = require("../../Middlewares/auth");
//const admin = require("../../Middlewares/admin");
let Pusher = require('pusher');
var cors = require("cors")
let Pusher = require('pusher');


  let pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID,
    key: process.env.PUSHER_APP_KEY,
    secret: process.env.PUSHER_APP_SECRET,
    cluster: process.env.PUSHER_APP_CLUSTER
});
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
    try{
        let message= new Messages();

   /*  let pusher = new Pusher({
        appId: process.env.PUSHER_APP_ID,
        key: process.env.PUSHER_APP_KEY,
        secret: process.env.PUSHER_APP_SECRET,
        cluster: process.env.PUSHER_APP_CLUSTER
    }); */
    let message= new Messages();
    message.from= req.body.from;
    message.to= req.body.to;
    message.roomId= req.body.roomId;
    message.messageBody = req.body.messageBody;
    message.messageVideo = req.body.messageVideo;
    message.time = req.body.time ;
    message.type = req.body.type;
    await message.save();
    /* pusher.trigger('private-my-channel', 'my-event', {
        data: req.body.messageBody,
      }//, {socket_id: req.headers['x-socket-id']}
      ); */
      //console.log("pusher",req.headers['x-socket-id'])
    return res.status(200).send("Message has been added to database successfully!");
    }
    catch(err){
        console.log(err)
    }

    //pusher.trigger('notifications', 'post_updated', post, req.headers['x-socket-id']);
    //sreturn res.send("Message has been added to database successfully!");

});
router.post("/pusher/auth", function(req, res) {
    const socketId = req.body.socket_id;
    const channel = req.body.channel_name;
    console.log(socketId)
    console.log(channel)
    const auth = pusher.authenticate(socketId, channel);
    res.send(auth);
  });
  


module.exports =  router;