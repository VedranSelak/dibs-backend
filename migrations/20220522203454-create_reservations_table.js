"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable("reservations", {
      id: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      listingId: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        references: {
          model: "public_listings",
          key: "id",
        },
      },
      spotId: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        references: {
          model: "spots",
          key: "id",
        },
      },
      isPrivate: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      arrivalTimestamp: {
        type: Sequelize.BIGINT(20),
        allowNull: false,
      },
      stayApprox: {
        type: Sequelize.BIGINT(20),
        allowNull: false,
      },
      numOfParticipants: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.dropTable("reservations");
  },
};
