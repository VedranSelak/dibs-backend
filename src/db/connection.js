const { Sequelize, DataTypes } = require("sequelize");
const dbConfig = require("../../config");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,
  dialectOptions: {
    supportBigNumbers: true,
  },

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
db.images = require("../models/Image")(sequelize, DataTypes);
db.spots = require("../models/Spot")(sequelize, DataTypes);
db.reservations = require("../models/Reservation")(sequelize, DataTypes);
db.rooms = require("../models/Room")(sequelize, DataTypes);
db.invites = require("../models/Invite")(sequelize, DataTypes);

db.users.hasOne(db.publicListings, {
  as: "public_listings",
  foreignKey: "ownerId",
});
db.publicListings.belongsTo(db.users, {
  as: "user",
  foreignKey: "ownerId",
});
db.publicListings.hasMany(db.images, {
  as: "images",
  foreignKey: "listingId",
});
db.images.belongsTo(db.publicListings, {
  as: "public_listing",
  foreignKey: "listingId",
});
db.publicListings.hasMany(db.spots, {
  as: "spots",
  foreignKey: "listingId",
});
db.spots.belongsTo(db.publicListings, {
  as: "public_listing",
  foreignKey: "listingId",
});
db.publicListings.hasMany(db.reservations, {
  as: "reservations",
  foreignKey: "listingId",
});
db.reservations.belongsTo(db.publicListings, {
  as: "publicListing",
  foreignKey: "listingId",
});
db.users.hasMany(db.rooms, {
  as: "rooms",
  foreignKey: "ownerId",
});
db.rooms.belongsTo(db.users, {
  as: "owner",
  foreignKey: "ownerId",
});
db.rooms.hasMany(db.invites, {
  as: "invites",
  foreignKey: "roomId",
});
db.invites.belongsTo(db.rooms, {
  as: "room",
  foreignKey: "roomId",
});
db.users.hasMany(db.invites, {
  as: "invites",
  foreignKey: "userId",
});
db.invites.belongsTo(db.users, {
  as: "user",
  foreignKey: "userId",
});
db.rooms.hasMany(db.reservations, {
  as: "reservations",
  foreignKey: "roomId",
});
db.reservations.belongsTo(db.rooms, {
  as: "room",
  foreignKey: "roomId",
});
db.users.hasMany(db.reservations, {
  as: "reservations",
  foreignKey: "userId",
});
db.reservations.belongsTo(db.users, {
  as: "user",
  foreignKey: "userId",
});

db.sequelize.sync({ force: false }).then(() => {
  console.log("Re-sync done!");
});

module.exports = db;
