"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable("images", {
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
      imageUrl: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.dropTable("images");
  },
};
