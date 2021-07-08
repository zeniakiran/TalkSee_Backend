var mongoose = require("mongoose");
const connectDB = async () => {
    const DB = process.env.mongoURI;
  mongoose.connect(DB,
     { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to mongo DB"))
  .catch((error) => console.log("DB is not connected"+error));
};

module.exports = connectDB;
