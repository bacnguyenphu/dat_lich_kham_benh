import axios from 'axios'
import Swal from 'sweetalert2'

const instance = axios.create({
  baseURL: 'http://localhost:3001/api/',
});

let isLoggingOut = false;

// Add a request interceptor
instance.interceptors.request.use(function (config) {
  // Do something before request is sent
  const persistedAuth = localStorage.getItem('persist:authUser');
  if (persistedAuth) {
    const parsed = JSON.parse(persistedAuth); // parse lần 1
    const token = JSON.parse(parsed.token);   // parse lần 2 (vì token cũng bị stringify)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
}, function (error) {
  // Do something with request error
  return Promise.reject(error);
});

// Add a response interceptor
instance.interceptors.response.use(function (response) {
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data

  return response.data;
}, async function (error) {
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Do something with response error
  if (error.response && error.response.status === 401 && !isLoggingOut) {
    await Swal.fire({
      title: "Phiên đăng nhập hết hạn, vui lòng đăng nhập lại!",
      icon: "error",
      confirmButtonText: "OK",
    });

    const persistedAuth = localStorage.getItem('persist:authUser');
    const parsed = JSON.parse(persistedAuth);
    const data = JSON.parse(parsed.data);
    const roleUser = data?.role
    // Chỉ chạy sau khi người dùng bấm OK
    if (roleUser === "R3") {
      window.location.href = "/login";
    }
    else if (roleUser === "R2") {
      window.location.href = "/doctor-login";
    }
    localStorage.removeItem("persist:authUser");
  }
  return Promise.reject(error);
});

export default instance  