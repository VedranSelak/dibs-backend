const express = require("express");
const User = require("../models/users");
const router = express.Router();

const { getAllUsers, registerUser } = require("../controllers/users");

router.get("/", getAllUsers);
router.post("/register", registerUser);

module.exports = router;
