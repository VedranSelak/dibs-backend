const express = require("express");
const router = express.Router();

const {
  createRoom,
  getRooms,
  getYourRooms,
  leaveRoom,
} = require("../controllers/rooms");

router.post("/", createRoom);
router.get("/", getRooms);
router.get("/your", getYourRooms);
router.patch("/leave/:id", leaveRoom);

module.exports = router;
