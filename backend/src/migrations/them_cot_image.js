'use strict';

//thêm cột image cho bảng medical_package
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Medical_packages', 'image', {
      type: Sequelize.STRING,
      allowNull: true, // hoặc false nếu bạn muốn bắt buộc
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Users', 'age');
  }
};
