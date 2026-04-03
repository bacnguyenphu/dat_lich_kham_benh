"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Patients", {
      // id_user: DataTypes.STRING,
      //   fullName: DataTypes.STRING,
      //   phone: DataTypes.STRING,
      //   email: DataTypes.STRING,
      //   dateOfBirth: DataTypes.DATE,
      //   gender: DataTypes.STRING,
      //   address: DataTypes.STRING,
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
      },
      id_user: {
        type: Sequelize.STRING,
      },
      fullName: {
        type: Sequelize.STRING,
      },
      phone: {
        type: Sequelize.STRING,
      },
      email: {
        type: Sequelize.STRING,
      },
      dateOfBirth: {
        type: Sequelize.DATE,
      },
      gender: {
        type: Sequelize.STRING,
      },
      address: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Patients");
  },
};
