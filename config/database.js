const mongoose = require("mongoose");
require("dotenv").config();

exports.connect = () => {
  mongoose
    .connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      // console.log("I am in DB file and connected connection successfully.");
      console.log("DB connected successfully");
    })
    .catch((error) => {
      console.log("DB has an issue/n");
      console.error(error);
      process.exit(1);
    });
};
