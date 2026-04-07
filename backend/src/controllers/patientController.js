const {
  getPatientsByIdUser,
  getPatients,
} = require("../services/patientService");

const handleGetPatientsByIdUser = async (req, res) => {
  try {
    const idUser = req.query.idUser || req.params.idUser;
    const message = await getPatientsByIdUser(idUser);
    return res.status(200).json(message);
  } catch (error) {
    console.log("Lỗi ở handleGetPatientsByIdUser: ", error);
    return res.status(500).json({
      err: -999,
      message: `Error server : ${error}`,
      data: [],
    });
  }
};

const handleGetPatients = async (req, res) => {
  try {
    const limit = req.query.limit;
    const page = req.query.page;
    const value = req.query.value;
    const message = await getPatients(+limit, +page, value);
    return res.status(200).json(message);
  } catch (error) {
    console.log("Lỗi ở handleGet    ", error);
    return res.status(500).json({
      err: -999,
      message: `Error server : ${error}`,
      data: [],
    });
  }
};

export { handleGetPatientsByIdUser, handleGetPatients };
