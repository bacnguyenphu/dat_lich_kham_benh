import axios from "../utils/customAxios";

const getStatistics = async () => {
  return axios.get("statistics");
};

export { getStatistics };
