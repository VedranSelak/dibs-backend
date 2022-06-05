const express = require("express");
const router = express.Router();

const {
  createRoom,
  getRooms,
  getYourRooms,
  leaveRoom,
  getRoomDetails,
} = require("../controllers/rooms");

router.post("/", createRoom);
router.get("/", getRooms);
router.get("/your", getYourRooms);
router.patch("/leave/:id", leaveRoom);
router.get("/:id", getRoomDetails);

module.exports = router;
