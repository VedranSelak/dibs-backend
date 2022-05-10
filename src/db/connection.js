const { Sequelize, DataTypes } = require("sequelize");
const dbConfig = require("../../config");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});

sequelize
  .authenticate()
  .then(() => {
    console.log("Connected...");
  })
  .catch((err) => console.log("Error", err));

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = require("../models/User")(sequelize, DataTypes);
db.publicListings = require("../models/PublicListing")(sequelize, DataTypes);
db.users.hasOne(db.publicListings, {
  as: "public_listings",
  foreignKey: "ownerId",
});
db.publicListings.belongsTo(db.users, {
  as: "user",
  foreignKey: "ownerId",
});

db.sequelize.sync({ force: false }).then(() => {
  console.log("Re-sync done!");
});

module.exports = db;
