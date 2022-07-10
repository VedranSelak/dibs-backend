const express = require("express");
const router = express.Router();

const {
  getInvites,
  respondToInvite,
  postInvites,
} = require("../controllers/invites");

router.get("/", getInvites);
router.patch("/:id", respondToInvite);
router.post("/:id", postInvites);

module.exports = router;
