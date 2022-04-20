var express = require("express");
const User = require("../models/users");
var router = express.Router();

/* GET users listing. */
router.get("/", function (req, res) {
  User.getAll((err, data) => {
    if (err) {
      res
        .status(500)
        .send({
          message: err.message || "Some error occurred while retrieving",
        });
    } else {
      res.send(data);
    }
  });
});

module.exports = router;
