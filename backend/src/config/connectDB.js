const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("dat_lich_kham_benh", "root", null, {
  host: "localhost",
  dialect: "mysql",
  timezone: "+07:00",
  // define: {
  //   freezeTableName: true // áp dụng cho toàn bộ model
  // }
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

module.exports = connectDB; // Sửa dòng này
