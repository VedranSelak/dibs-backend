const express = require("express");
const router = express.Router();

const authorizationMiddleware = require("../middleware/auth");
const {
  getAllListings,
  createPublicListing,
  getListingDetails,
  searchListings,
} = require("../controllers/listings");

router.get("/", getAllListings);
router.get("/search/:search", searchListings);
router.post("/", authorizationMiddleware, createPublicListing);
router.get("/:id", getListingDetails);

module.exports = router;
