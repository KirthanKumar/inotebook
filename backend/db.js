// here we are using commonjs modules not ES6 modules

const mongoose = require("mongoose");
const mongoURI = "mongodb://localhost:27017/";

const connectToMongo = () => {
  mongoose
    .connect(mongoURI)
    .then(() => {
      console.log("Connected to MongoDB successfully");
    })
    .catch((error) => {
      console.error("Error connecting to MongoDB:", error);
    });
};

module.exports = connectToMongo;
