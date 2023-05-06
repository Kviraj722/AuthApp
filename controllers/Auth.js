const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
require("dotenv").config();
exports.signup = async (req, res) => {
  try {
    //get data
    // console.log(
    //   "Okay, I am in Auth.js and hitting signup handler, Thanks Bye..."
    // );
    const { name, email, password, role, createdAt } = req.body;
    const existingUser = await User.findOne({ email, name });
    if (existingUser) {
      // console.log("Abey, Mere pass account hai.");
      return res.status(400).json({
        success: false,
        message: "User already exits",
      });
    }
    // console.log("Account create kar raha hun, Nahi hai account, Huh.");
    // make secure password
    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(password, 10);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error in hashing password",
      });
    }

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      createdAt,
    });
    // console.log("User created successfully, Now Get Lost, Bye.");
    return res
      .status(200)
      .json({ success: true, message: "User created successfully" });
  } catch (error) {
    // console.log(
    //   "Somehow I ended up in Catch block of Auth.js signup handler, and I am not able to create newUser"
    // );
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "User can not be register, Please try again after sometime",
    });
  }
};

//login

exports.login = async (req, res) => {
  try {
    //fetching the data
    const { email, password } = req.body;
    //validation on email and password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill all the details",
      });
    }
    //user exists or not?
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User is not registered",
      });
    }

    //verify password and generate a JWT token.
    const payload = { email: user.email, id: user._id, role: user.role };
    if (await bcrypt.compare(password, user.password)) {
      let token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "1hr",
      });
      user.token = token;
      user.password = undefined;

      console.log("Token is : ", token);
      console.log("USer is : ", user);
      let options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };
      res.cookie("token", token, options).status(200).json({
        success: true,
        token,
        user,
        message: "User logged in successfully",
      });
      // res.status(200).json({
      //   success: true,
      //   token,
      //   user,
      //   message: "User logged in successfully",
      // });
    } else {
      return res.status(403).json({
        success: false,
        message: "Incorrect Password",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Login failure",
    });
  }
};
