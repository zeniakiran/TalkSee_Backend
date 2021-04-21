const express = require("express");
const router = express.Router();
const { UserModel } = require("../../models/UserModel");
 
router.get("/getContact", async (req, res) => {
  const product = await UserModel.find();
  return res.status(200).send(product);
});

router.get("/get-contact/:id", async (req, res) => {
  try {
    const { friends } = await UserModel.findById(req.params.id);
    const { friendRequests } = await UserModel.findById(req.params.id);
    var ar=[];
    for(i =0; i <friends.length; i++)
        ar[i]=friends[i].id
        j=friends.length;
    for(i =0; i <friendRequests.length; i++)
        {ar[j]=friendRequests[i].id
       j++;}

    const users = await UserModel.find({ _id: { $nin: ar} })
    res.json(users);
   } catch (err) {
       console.error(err.message);
       res.status(500).send("Servor Error");
   }
});

 
module.exports = router;