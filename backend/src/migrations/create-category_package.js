'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Category_packages', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.STRING
            },
            name: {
                type: Sequelize.STRING
            },
            image: {
                type: Sequelize.STRING
            },
            description: {
                type: Sequelize.STRING
            },
            slug: {
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
        await queryInterface.dropTable('Category_packages');
    }
};