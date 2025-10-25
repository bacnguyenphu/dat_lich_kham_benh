'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Appointments', {
            // id_doctor: DataTypes.STRING,
            // id_patient: DataTypes.STRING,
            // id_medical_package: DataTypes.STRING,
            // appointment_date: DataTypes.DATE,
            // time: DataTypes.STRING,
            // status: DataTypes.INTEGER,
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.STRING
            },
            id_doctor: {
                type: Sequelize.STRING
            },
            id_patient: {
                type: Sequelize.STRING
            },
            id_medical_package: {
                type: Sequelize.STRING
            },
            appointment_date: {
                type: Sequelize.DATE
            },
            time: {
                type: Sequelize.STRING
            },
            status: {
                type: Sequelize.INTEGER,
                allowNull:false,
                defaultValue:1
            },
            payment_status:{
                type:Sequelize.BOOLEAN,
                allowNull:true
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
        await queryInterface.dropTable('Appointments');
    }
};