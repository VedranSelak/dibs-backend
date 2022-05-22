"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable("spots", {
      id: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      listingId: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        references: {
          model: "public_listings",
          key: "id",
        },
      },
      availableSpots: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
      },
      rowName: {
        type: Sequelize.STRING(3),
        allowNull: true,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.dropTable("spots");
  },
};
