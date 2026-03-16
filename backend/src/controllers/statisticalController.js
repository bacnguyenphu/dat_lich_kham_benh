const { getStatistics } = require("../services/statisticalService");

const handleGetStatistics = async (req, res) => {
  try {
    const message = await getStatistics();
    return res.status(200).json(message);
  } catch (error) {
    console.log("Lỗi ở handleGetStatistics: ", error);
    return res.status(500).json({
      err: -999,
      message: `Error server: ${error}`,
    });
  }
};

module.exports = {
  handleGetStatistics,
};
