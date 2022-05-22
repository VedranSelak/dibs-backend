const express = require("express");
const router = express.Router();

const authorizationMiddleware = require("../middleware/auth");
const { createReservation } = require("../controllers/reservations");

router.post("/", authorizationMiddleware, createReservation);

module.exports = router;
