'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Medical_package extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Medical_package.belongsTo(models.Category_package,{foreignKey:'id_category_package', as:'category_package'})
            Medical_package.belongsTo(models.Description_detail,{foreignKey:'id_description_detail', as:'description_detail'})
            Medical_package.hasMany(models.Appointment,{foreignKey:'id_medical_package',as:'medical_package'})
        }
    }
    Medical_package.init({
        // - id
        // - name
        // - id_description_detail(fk)
        // - price

        name: DataTypes.STRING,
        id_description_detail: DataTypes.STRING,
        price: DataTypes.FLOAT,
        image: DataTypes.STRING,
        description: DataTypes.STRING,
        id_category_package: DataTypes.STRING,
    }, {
    sequelize,
    modelName: 'Medical_package',
});
return Medical_package;
};