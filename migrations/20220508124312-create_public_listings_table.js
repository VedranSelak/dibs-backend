"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable("public_listings", {
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
      shortDescription: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      detailedDescription: {
        type: Sequelize.STRING(300),
        allowNull: false,
      },
      type: {
        type: Sequelize.STRING(45),
        allowNull: false,
      },
      parentId: {
        type: Sequelize.INTEGER(11),
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.dropTable("public_listings");
  },
};
