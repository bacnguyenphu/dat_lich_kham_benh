import axios from "../utils/customAxios";

const postComment = (data) => {
  return axios.post("create-comment", data);
};

const updateComment = (data) => {
  return axios.put("update-comment", data);
};

const getCommentsbyAppointmentId = (appointmentId) => {
  return axios.get(
    `get-comments-by-appointment-id?appointmentId=${appointmentId}`,
  );
};

const getCommentsByTarget = (targetId, targetType) => {
  return axios.get(
    `get-comments?targetId=${targetId}&targetType=${targetType}`,
  );
};

const deleteComment = (commentId) => {
  return axios.delete(`delete-comment?id=${commentId}`);
};

export {
  postComment,
  getCommentsByTarget,
  getCommentsbyAppointmentId,
  updateComment,
  deleteComment,
};
