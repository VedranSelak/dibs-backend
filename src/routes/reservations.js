const express = require("express");
const router = express.Router();

const authorizationMiddleware = require("../middleware/auth");
const {
  createReservation,
  getUpcomingReservations,
  getRecentReservations,
  createRoomReservation,
  getRecentListingReservations,
  getUpcomingListingReservations,
} = require("../controllers/reservations");

router.post("/", authorizationMiddleware, createReservation);
router.get("/upcoming", authorizationMiddleware, getUpcomingReservations);
router.get("/recent", authorizationMiddleware, getRecentReservations);
router.post("/room", authorizationMiddleware, createRoomReservation);
router.get(
  "/recent/listing",
  authorizationMiddleware,
  getRecentListingReservations
);
router.get(
  "/upcoming/listing",
  authorizationMiddleware,
  getUpcomingListingReservations
);

module.exports = router;
