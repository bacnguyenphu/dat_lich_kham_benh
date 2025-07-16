'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Category_package extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Category_package.hasMany(models.Medical_package,{foreignKey:'id_category_package',as:'medical_package'})
        }
    }
    Category_package.init({
        name: DataTypes.STRING,
        image: DataTypes.STRING,
        description: DataTypes.STRING,
        slug: DataTypes.STRING,
    }, {
        sequelize,
        modelName: 'Category_package',
    });
    return Category_package;
};