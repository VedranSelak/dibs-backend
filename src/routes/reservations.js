const express = require("express");
const router = express.Router();

const authorizationMiddleware = require("../middleware/auth");
const {
  createReservation,
  getUpcomingReservations,
  getRecentReservations,
  createRoomReservation,
} = require("../controllers/reservations");

router.post("/", authorizationMiddleware, createReservation);
router.get("/upcoming", authorizationMiddleware, getUpcomingReservations);
router.get("/recent", authorizationMiddleware, getRecentReservations);
router.post("/room", authorizationMiddleware, createRoomReservation);

module.exports = router;
