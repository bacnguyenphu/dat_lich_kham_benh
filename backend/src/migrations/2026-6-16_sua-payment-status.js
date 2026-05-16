"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("Appointments", "payment_status", {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "unpaid",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn("Appointments", "status");
  },
};
