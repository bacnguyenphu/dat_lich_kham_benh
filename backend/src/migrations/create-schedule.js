'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Schedules', {
            // id_doctor: DataTypes.STRING,
            // appointment_date: DataTypes.DATE,
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.STRING
            },
            id_doctor: {
                type: Sequelize.STRING
            },
            appointment_date: {
                type: Sequelize.DATE
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
        await queryInterface.dropTable('Schedules');
    }
};