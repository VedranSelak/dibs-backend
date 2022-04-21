const express = require("express");
const router = express.Router();

const { getAllUsers, registerUser } = require("../controllers/users");
const authorizationMiddleware = require("../middleware/auth");

router.get("/", authorizationMiddleware, getAllUsers);
router.post("/register", registerUser);

module.exports = router;
