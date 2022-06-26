const express = require("express");
const router = express.Router();

const {
  searchUsers,
  getAccountDetails,
  patchUserDetails,
  getHasListing,
} = require("../controllers/users");

router.get("/me", getAccountDetails);
router.get("/search/:search", searchUsers);
router.patch("/", patchUserDetails);
router.get("/listing", getHasListing);

module.exports = router;
