const express = require("express");
const router = express.Router();

const authorizationMiddleware = require("../middleware/auth");
const {
  getAllListings,
  createPublicListing,
} = require("../controllers/listings");

router.get("/", getAllListings);
router.post("/", authorizationMiddleware, createPublicListing);

module.exports = router;
