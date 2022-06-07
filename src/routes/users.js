const express = require("express");
const router = express.Router();

const { searchUsers, getAccountDetails } = require("../controllers/users");

router.get("/me", getAccountDetails);
router.get("/search/:search", searchUsers);

module.exports = router;
