"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable("rooms", {
      id: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      ownerId: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      description: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      imageUrl: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      capacity: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.dropTable("rooms");
  },
};
