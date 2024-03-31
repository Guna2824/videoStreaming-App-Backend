const express = require("express");
const router = express.Router();

const jwt = require("jsonwebtoken");
const connectDB = require("../models/DB");
const People = require("../models/people");
const multer = require("multer");

// ______________________________________________

// Multer storage configuration
const storageOne = multer.diskStorage({
  destination: "./src/uploads/",
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const uploadOne = multer({
  storage: storageOne,
  limits: { fileSize: 2000000 }, // Limit file size to 1MB
}).single("imageUrl");

// Handle image upload
router.post("/imageupload", (req, res) => {
  uploadOne(req, res, (err) => {
    if (err) {
      console.error("Error uploading image:", err);
      return res.status(500).send("Error uploading image");
    }
    // console.log("Image uploaded successfully");
    return res.status(200).json({ imageUrl: req.file.originalname });
  });
});

// __________________________________________________________
// signup api

router.post("/register", async (req, res) => {
  try {
    const user = await People.findOne({ name: req.body.name });
    if (user) {
      return res.status(404).send("Username already exsit");
    }

    const { name, phone, email, password, imageUrl } = req.body;
    // console.log(name, phone, email, password, imageUrl);

    const people = new People({
      name: name,
      phone: phone,
      email: email,
      password: password,
      imageUrl: imageUrl,
    });
    await people.save();
    res.status(201).json({ message: "User signup successfully" });
  } catch (err) {
    console.error("Error uploading user", err);
    res.status(500).json({ message: "Signup filed" });
  }
});
// _______________________________________________________________________
// Login api

router.post("/login", async (req, res) => {
  // const {name, password} = req.body
  try {
    const user = await People.findOne({ name: req.body.name });
    if (!user) {
      return res.status(404).send("Username not exsit");
    }
    if (user.password !== req.body.password) {
      return res.status(401).send("Invalid password.");
    }
    var userToken = await jwt.sign({ userId: user._id }, "ZeeBoomBaa");
    res.header("auth", userToken).json(userToken);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

// ____________________________________________
// middleware verifyToken

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const decoded = jwt.verify(token, "ZeeBoomBaa");
    const userId = decoded.userId;
    // console.log(userId);
    req.token = userId;
    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    return res.status(401).json({ message: "Token verification failed" });
  }
};

router.put("/loginstatus", verifyToken, async (req, res) => {
  const userId = req.token;
  const { logInStatus, logInTime } = req.body;
  // console.log(logInStatus, logInTime);
  try {
    const data = await People.findOneAndUpdate(
      { _id: userId },
      { logInStatus: logInStatus, logInTime: logInTime }
    );
    res.status(200).json(data);
  } catch (err) {
    res.status(401).json({ message: "Unauthorized" });
  }
});

// _____________________________________________________________
// Login user details api

router.get("/profile", verifyToken, async (req, res) => {
  const userId = req.token;
  try {
    const data = await People.find({ _id: userId });
    res.status(200).json(data);
  } catch (err) {
    res.status(401).json({ message: "Unauthorized" });
  }
});

connectDB();

module.exports = router;
