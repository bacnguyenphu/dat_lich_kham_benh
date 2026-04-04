const { getPatientsByIdUser } = require("../services/patientService");

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

export { handleGetPatientsByIdUser };
