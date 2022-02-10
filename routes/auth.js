const router = require("express").Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { json } = require("express");

//REGISTER
router.post("/register", async (req, res) => {
  try {
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });

    const user = await newUser.save();
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

//LOGIN
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    !user && res.status(400).json("Wrong credentials!");

    const validated = (await req.body.password) === user.password;
    !validated && res.status(400).json("Wrong credentials!");

    const { password, ...others } = user._doc;
    const userid = others._id.valueOf();
    const useradmin = others.isAdmin;

    const useremail = others.email;
    const userusername = others.username;

    console.log(others);
    // return res.status(200).json(others);
    // generate acess token
    others.accessToken = jwt.sign(
      {
        id: userid,
        username: userusername,
        isAdmin: useradmin,
        email: useremail,
      },
      process.env.SECRET_KEY
    );
    return res.status(200).json(others);
  } catch (err) {
    // return res.status(500).json(err);
  }
});

module.exports = router;
