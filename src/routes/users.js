const express = require("express");
const router = express.Router();

const {
  searchUsers,
  getAccountDetails,
  patchUserDetails,
} = require("../controllers/users");

router.get("/me", getAccountDetails);
router.get("/search/:search", searchUsers);
router.patch("/", patchUserDetails);

module.exports = router;
