'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('Description_details', 'description', {
      type: Sequelize.TEXT('medium'),
      allowNull: true, // hoặc false tùy yêu cầu
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('Description_details', 'description', {
      type: Sequelize.TEXT,
      allowNull: true, // hoặc false tùy yêu cầu
    });
  }
};
