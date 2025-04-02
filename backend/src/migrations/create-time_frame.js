'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Time_frames', {
            // time_frame: DataTypes.STRING,
            // id_schedule: DataTypes.STRING,
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.STRING
            },
            time_frame: {
                type: Sequelize.STRING
            },
            id_schedule: {
                type: Sequelize.STRING
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
        await queryInterface.dropTable('Time_frames');
    }
};