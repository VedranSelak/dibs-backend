const sql = require("../db/db.js");
const bcrypt = require("bcryptjs");
const BadRequest = require("../errors/badRequest.js");
const Unauthenticated = require("../errors/unauthenticated.js");

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

User.create = (newUser, result) => {
  sql.query("INSERT INTO users SET ?", newUser, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    console.log("User registerd: ", { id: res.insertId, ...newUser });
    result(null, { id: res.insertId, type: newUser.type });
  });
};

User.login = (credentials, result) => {
  sql.query(
    "SELECT id, password, type FROM users WHERE email = ?",
    credentials.email,
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
      if (res.length <= 0) {
        result(
          new BadRequest("No account created for the provided email"),
          null
        );
        return;
      }

      const user = res[0];
      console.log("USER:");
      console.log(user);

      bcrypt.compare(credentials.password, user.password, (err, res) => {
        if (err) {
          result(err, null);
          return;
        }
        if (!res) {
          result(new Unauthenticated("Incorrect password"), null);
          return;
        }
        const { id, type } = user;
        result(null, { id, type });
      });
    }
  );
};

User.hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

module.exports = User;
