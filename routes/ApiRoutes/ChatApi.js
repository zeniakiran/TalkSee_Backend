require('dotenv').config();
var express = require('express');
var router = express.Router();
//const validateProducts = require("../../Middlewares/validation");
var { Messages } = require("../../models/MessageModel");
var { UserModel } = require("../../models/UserModel");
//const auth = require("../../Middlewares/auth");
//const admin = require("../../Middlewares/admin");
//let Pusher = require('pusher');
var cors = require("cors")

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
        });
        if(!messageFromDb) 
            return res.send("No messages from current email"); 
        console.log(messageFromDb)
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

router.get("/offlinemessages/:email",async (req, res) => {
    try {
        let emailAdd = req.params.email;
        /* let messageFromDb = await Messages.find({
             $or: [ { from: emailAdd},
                    {to : emailAdd} ] 
        }); */
        let messageFromDb = await Messages.find({
            to:emailAdd
       });
        if(!messageFromDb) 
            return res.send("No messages from current email"); 

        let myArray = messageFromDb;
        //console.log("my msg array", myArray)
        let myCount = 0;
        let obj;
        let arrayFrom = []
        let arrayTo = []
        myArray.map((elem)=>{
            if(elem.type === 'offline'){
                myCount = myCount+1
                //obj.push({sender : elem.from, receiver : elem.to})
                arrayFrom.push(elem.from)
                arrayTo.push(elem.to)
            }
        })
        //console.log("my Count val", myCount)
        
        arrayFrom = Array.from(new Set(arrayFrom));
        arrayTo = Array.from(new Set(arrayTo));
        obj = {sender: arrayFrom, receiver: arrayTo}
        return res.send({count: myCount, info : obj}); 
    }
    catch(err){
        res.status(400).send(err);
     } 
}); 

router.get("/chatrecipients/:email",async (req, res) => {
    try {
        let emailAdd = req.params.email;
       // console.log("add",emailAdd)
        let chatsFromDb = await Messages.find({
             $or: [ { from: emailAdd},
                    {to : emailAdd} ] 
            /* from : email[0],
            to : email[1] */
            //from : emailAdd
        });
        let dummy=[]
        let chatRecipients=[]
        if(!chatsFromDb || chatsFromDb.length===0) 
            return res.send("No messages from current email");
        else{
            chatsFromDb.map((chat)=>{
                dummy.push(chat.to)
                dummy.push(chat.from)
            })
            const array = Array.from(new Set(dummy));
            array.map((r)=>{
                if(r !== emailAdd)
                    chatRecipients.push(r)
            })
            
            return res.send(chatRecipients); 
        } 
        
    }
    catch(err){
        console.log(err)
        res.status(400).send(err);
     } 
}); 

router.get("/lastmsg/:email",async (req, res) => {
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

        let data = await UserModel.find({
            email : email[1]
        });

        //console.log("data",data[0])
        if(!messageFromDb) 
            return res.status(400).send("No messages from current email"); 
        let obj ={lastMsg: messageFromDb[(messageFromDb.length)-1].messageBody, 
                msgId : messageFromDb[(messageFromDb.length)-1]._id,
                type: messageFromDb[(messageFromDb.length)-1].type,
                sender: messageFromDb[(messageFromDb.length)-1].from,
                time : messageFromDb[(messageFromDb.length)-1].time, 
                userName : data[0].firstName+" "+data[0].lastName,
                img : data[0].profileImg, lang:data[0].langPreference, id: data[0]._id}
        console.log("myobj",obj)
        return res.status(200).send(obj) 
    }
    catch(err){
        res.status(400).send(err);
     } 
}); 

router.post("/",async (req,res)=>{
    try{
    let message= new Messages();
    message.from= req.body.from;
    message.to= req.body.to;
    message.roomId= req.body.roomId;
    message.messageBody = req.body.messageBody;
    message.messageVideo = req.body.messageVideo;
    message.time = req.body.time ;
    message.type = req.body.type;
    message.msgId = req.body.msgId
    await message.save();
    return res.status(200).send("Message has been added to database successfully!");
    }
    catch(err){
        console.log(err)
    }

});

  router.delete("/:id", async (req,res)=>{
    try{
        console.log(req.params.id)
        let msgId = await Messages.findOneAndDelete({msgId : req.params.id});
        if(!msgId) 
            return res.send("Message does not exist");

        return res.send("The message has been deleted successfully!");
    }
    catch(err){
        res.status(400).send("Invalid Id");
    }

});

router.put("/:id",async (req,res)=>{
    try{
        let msgId = await Messages.findById(req.params.id);
    if(!msgId) 
        return res.send("Message doesn't exist");
    msgId.type= req.body.type;
    await msgId.save();
    return res.send("Type updated!");
    }
    catch(err){
        console.log(err)
    }
});


module.exports =  router;