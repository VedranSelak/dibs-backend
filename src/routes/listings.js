const express = require("express");
const router = express.Router();

const authorizationMiddleware = require("../middleware/auth");
const {
  getAllListings,
  createPublicListing,
  getListingDetails,
} = require("../controllers/listings");

router.get("/", getAllListings);
router.post("/", authorizationMiddleware, createPublicListing);
router.get("/:id", getListingDetails);

module.exports = router;
