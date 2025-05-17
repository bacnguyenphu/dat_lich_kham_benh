'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Description_detail extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    Description_detail.init({
        description: DataTypes.STRING,
        
    }, {
        sequelize,
        modelName: 'Description_detail',
    });
    return Description_detail;
};