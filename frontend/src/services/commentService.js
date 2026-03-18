import axios from "../utils/customAxios";

const postComment = (data) => {
  return axios.post("create-comment", data);
};

export { postComment };
