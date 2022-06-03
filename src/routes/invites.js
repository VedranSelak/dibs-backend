const express = require("express");
const router = express.Router();

const { getInvites, respondToInvite } = require("../controllers/invites");

router.get("/", getInvites);
router.patch("/:id", respondToInvite);

module.exports = router;
