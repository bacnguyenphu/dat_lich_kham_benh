"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Sử dụng Promise.all để đảm bảo tất cả các cột được thêm vào
    return Promise.all([
      queryInterface.addColumn("Appointments", "id_user", {
        type: Sequelize.STRING,
      }),
      queryInterface.addColumn("Appointments", "isCheckIn", {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      }),
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    // Khi rollback, phải xóa ngược lại đúng bấy nhiêu cột
    return Promise.all([
      queryInterface.removeColumn("Appointments", "id_user"),
      queryInterface.removeColumn("Appointments", "isCheckIn"),
    ]);
  },
};
