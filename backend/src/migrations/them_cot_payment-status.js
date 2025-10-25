'use strict';

//thêm cột payment-status cho bảng Appoitment
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Appointments', 'payment_status', {
      type: Sequelize.BOOLEAN,
      allowNull: true, // hoặc false nếu bạn muốn bắt buộc
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Appointments', 'payment_status');
  }
};