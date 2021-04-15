const express = require("express");
const router = express.Router();
const { UserModel } = require("../../models/UserModel");
 
router.get("/getContact", async (req, res) => {
  const product = await UserModel.find();
  return res.status(200).send(product);
});
 
module.exports = router;