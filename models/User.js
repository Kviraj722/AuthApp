const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
    trim: true,
  },
  email: {
    type: String,
    require: true,
    trim: true,
  },
  password: {
    type: String,
    require: true,
  },

  role: {
    type: String,
    enum: ["Admin", "Student", "Visitor"],
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now(),
  },
});
module.exports = mongoose.model("user", userSchema);
