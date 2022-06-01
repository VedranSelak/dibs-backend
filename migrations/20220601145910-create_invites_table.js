"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable("invites", {
      id: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      roomId: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        references: {
          model: "rooms",
          key: "id",
        },
      },
      ownerId: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      userId: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      isAccepted: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      isIgnored: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.dropTable("invites");
  },
};
