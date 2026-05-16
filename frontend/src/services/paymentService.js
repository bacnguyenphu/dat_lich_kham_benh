import axios from "../utils/customAxios";

export const createPaymentVnpay = (data) => {
  return axios.post("create-payment", data);
};
