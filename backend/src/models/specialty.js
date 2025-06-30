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
            Specialty.belongsToMany(models.Doctor,{through:'Specialty_doctor', as:'doctor',foreignKey:'id_specialty'})
            Specialty.belongsTo(models.Description_detail,{foreignKey:'id_description_detail', as:'description_detail'})
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
        slug: DataTypes.STRING,
        id_description_detail: DataTypes.STRING,
        
    }, {
        sequelize,
        modelName: 'Specialty',
    });
    return Specialty;
};