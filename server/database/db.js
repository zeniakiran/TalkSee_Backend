var mongoose = require("mongoose");
var config = require("config");
const connectDB = async () => {
  mongoose.connect(config.get("db"),
     { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to mongo DB"))
  .catch((error) => console.log("DB is not connected"+error));
};

module.exports = connectDB;
