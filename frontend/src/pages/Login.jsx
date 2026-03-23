import bg_image from "../assets/bg_login.png";
import { useNavigate } from "react-router-dom";
import { REGISTER } from "../utils/path";
import { useState } from "react";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import { FaAngleLeft, FaRegEye, FaRegEyeSlash } from "react-icons/fa6"; // Thêm icon mắt
import { useDispatch } from "react-redux";
import { loginUser } from "../redux/authSlice";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [payload, setPayload] = useState({
    phone: "",
    password: "",
  });

  // State quản lý việc ẩn/hiện mật khẩu
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (payload.phone.trim() === "" || payload.password.trim() === "") {
      Swal.fire({
        title: "Đăng nhập thất bại",
        text: "Vui lòng nhập đầy đủ Số điện thoại và Mật khẩu",
        icon: "warning",
        confirmButtonColor: "#3B82F6",
      });
      return;
    }

    const res = await dispatch(loginUser(payload));

    if (res.payload?.error === 0) {
      Swal.fire({
        title: res.payload?.message,
        icon: "success",
        showConfirmButton: false,
        timer: 1500,
      }).then(() => {
        navigate("/");
      });
    } else {
      Swal.fire({
        title: "Đăng nhập thất bại",
        text: res.payload?.message || "Đã có lỗi xảy ra",
        icon: "error",
        confirmButtonColor: "#EF4444",
      });
    }
  };

  const handleOnChange = (e) => {
    setPayload({ ...payload, [e.target.name]: e.target.value });
  };

  return (
    <div
      className="min-h-screen bg-no-repeat bg-center bg-cover relative flex items-center justify-center lg:justify-start w-full"
      style={{ backgroundImage: `url(${bg_image})` }}
    >
      {/* Overlay làm tối nền một chút để làm nổi bật form (Tùy chọn) */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]"></div>

      <div className="relative z-10 bg-white/95 backdrop-blur-md w-[90%] sm:w-[400px] lg:ml-[10%] rounded-br-[40px] rounded-tl-[40px] shadow-2xl p-8 sm:p-10 flex flex-col gap-8 transition-all">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <h2 className="font-bold text-3xl text-gray-800 tracking-tight">
            Đăng nhập
          </h2>
          <p className="text-gray-500 text-sm">Chào mừng bạn quay trở lại!</p>
        </div>

        {/* Form Elements */}
        <div className="flex flex-col gap-5">
          {/* Số điện thoại */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="phone"
              className="text-sm font-medium text-gray-700"
            >
              Số điện thoại
            </label>
            <input
              id="phone"
              name="phone"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Nhập số điện thoại"
              value={payload.phone}
              onChange={handleOnChange}
            />
          </div>

          {/* Mật khẩu */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="password"
              className="text-sm font-medium text-gray-700"
            >
              Mật khẩu
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                className="w-full border border-gray-300 rounded-lg pl-4 pr-11 py-2.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                type={showPassword ? "text" : "password"}
                placeholder="Nhập mật khẩu"
                value={payload.password}
                onChange={handleOnChange}
              />
              {/* Nút Ẩn/Hiện mật khẩu */}
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <FaRegEyeSlash size={18} />
                ) : (
                  <FaRegEye size={18} />
                )}
              </button>
            </div>
          </div>

          {/* Liên kết phụ */}
          <div className="flex items-center justify-between mt-1">
            <span className="text-sm text-blue-600 hover:text-blue-800 font-medium cursor-pointer transition-colors">
              Quên mật khẩu?
            </span>
            <span
              className="text-sm text-blue-600 hover:text-blue-800 font-medium cursor-pointer transition-colors"
              onClick={() => navigate(REGISTER)}
            >
              Đăng ký ngay
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-4 mt-2">
          <button
            className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-semibold text-lg py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
            onClick={handleLogin}
          >
            Đăng nhập
          </button>

          <button
            className="flex items-center justify-center gap-2 text-gray-500 hover:text-gray-800 font-medium transition-colors mt-2 group"
            onClick={() => navigate("/")}
          >
            <FaAngleLeft className="group-hover:-translate-x-1 transition-transform" />
            <span>Về trang chủ</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
