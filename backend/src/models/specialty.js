'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Specialty extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    Specialty.init({
        // - id
        // - name
        // - images
        // - id_description_detail (fk)
        name: DataTypes.STRING,
        images: DataTypes.STRING,
        title: DataTypes.STRING,
        id_description_detail: DataTypes.STRING,
        
    }, {
        sequelize,
        modelName: 'Specialty',
    });
    return Specialty;
};