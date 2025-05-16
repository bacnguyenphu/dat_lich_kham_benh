'use strict';
//Sửa kiểu dữ liệu của cột avatar trong bảng User
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn('Users', 'avatar', {
      type: Sequelize.STRING,
      allowNull: true, // hoặc false tùy yêu cầu
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn('Users', 'avatar', {
      type: Sequelize.BLOB,
      allowNull: true, // rollback
    });
  }
};
