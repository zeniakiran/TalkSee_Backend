var express = require('express');
var router = express.Router();
//const validateProducts = require("../../Middlewares/validation");
var { Group } = require("../../models/GroupModel");
//const auth = require("../../Middlewares/auth");
//const admin = require("../../Middlewares/admin");
var cors = require("cors")
const corsOptions = {
    origin: 'https://localhost:4000',
  }
router.get("/", async (req, res) => {
    try {
        let groupsFromDb = await Group.find();
        if(!groupsFromDb) 
            return res.send("There are currently no Groups");
            //res.json(productsFromDb.imgUrl)
        return res.send(groupsFromDb);
    }
    catch(err){
        res.status(400).send(err);
     } 
});

router.get("/:groupId", async (req, res) => {
    try {
        let groupFromDb = await Group.find({
            groupId : req.params.groupId
        });
        if(!groupFromDb) 
            return res.send("There are currently no Groups");
            //res.json(productsFromDb.imgUrl)
        return res.send(groupFromDb);
    }
    catch(err){
        res.status(400).send(err);
     } 
});


router.post("/",async (req,res)=>{
    let group= new Group();
    group.groupName= req.body.groupName;
    group.groupId= req.body.groupId;
    group.createdBy= req.body.createdBy;
    group.groupMembers = req.body.groupMembers;
    await group.save();
    return res.send("Group has been successfully created!");

});



module.exports =  router;