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
      result(null, err);
      return;
    }
    result(null, res);
  });
};

User.create = (newUser, result) => {
  sql.query("INSERT INTO users SET ?", newUser, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    result(null, { id: res.insertId, type: newUser.type });
  });
};

User.login = (credentials, result) => {
  sql.query(
    "SELECT id, password, type FROM users WHERE email = ?",
    credentials.email,
    async (err, res) => {
      if (err) {
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

      const isPasswordValid = await bcrypt.compare(
        credentials.password,
        user.password
      );
      if (isPasswordValid) {
        const { id, type } = user;
        result(null, { id, type });
      } else {
        result(new Unauthenticated("Invalid password"), null);
      }
    }
  );
};

User.hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

module.exports = User;
