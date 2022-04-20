const sql = require("../db/db.js");

const User = function (user) {
  this.email = user.email;
  this.first_name = user.first_name;
  this.last_name = user.last_name;
  this.password = user.password;
  this.status = user.status;
  this.type = user.type;
};

User.getAll = (result) => {
  let query = "SELECT * FROM users";
  sql.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }
    console.log("users: ", res);
    result(null, res);
  });
};

module.exports = User;
