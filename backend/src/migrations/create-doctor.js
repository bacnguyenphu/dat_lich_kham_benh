'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Doctors', {
      // irstName: DataTypes.STRING,
      // lastName: DataTypes.STRING,
      // phone: DataTypes.STRING,
      // description: DataTypes.STRING,
      // id_specialty: DataTypes.STRING,
      // id_description_detail: DataTypes.STRING,
      // id_position: DataTypes.STRING,
      // gender: DataTypes.STRING,
      // price: DataTypes.STRING,
      // avatar: DataTypes.BLOB,
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.STRING
      },
      id_specialty: {
        type: Sequelize.STRING
      },
      id_description_detail: {
        type: Sequelize.STRING
      },
      id_position: {
        type: Sequelize.STRING
      },
      price: {
        type: Sequelize.FLOAT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Doctors');
  }
};