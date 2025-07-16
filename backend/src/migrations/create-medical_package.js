'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Medical_packages', {
            // name: DataTypes.STRING,
            // id_description_detail: DataTypes.STRING,
            // price: DataTypes.FLOAT,
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.STRING
            },
            name: {
                type: Sequelize.STRING
            },
            id_description_detail: {
                type: Sequelize.STRING
            },
            price: {
                type: Sequelize.FLOAT
            },
            image: {
                type: Sequelize.STRING
            },
            description: {
                type: Sequelize.STRING
            },
            id_category_package: {
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
        await queryInterface.dropTable('Medical_packages');
    }
};