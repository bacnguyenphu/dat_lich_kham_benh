import axios from "../utils/customAxios";

const postComment = (data) => {
  return axios.post("create-comment", data);
};

const getCommentsbyAppointmentId = (appointmentId) => {
  return axios.get(
    `get-comments-by-appointment-id?appointmentId=${appointmentId}`,
  );
};

export { postComment, getCommentsbyAppointmentId };
