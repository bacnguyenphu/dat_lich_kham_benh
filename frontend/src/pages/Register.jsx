import bg_image from "../assets/bg_login.png";
import { useNavigate } from "react-router-dom";
import { LOGIN } from "../utils/path";
import { useState } from "react";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import { register } from "../services/authService";
import { FaAngleLeft, FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

function Register() {
  const navigate = useNavigate();

  const [data, setData] = useState({
    phone: "",
    password: "",
    passwordConfirm: "",
  });

  // States quản lý việc ẩn/hiện mật khẩu cho 2 trường khác nhau
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleRegister = async () => {
    // Kiểm tra dữ liệu rỗng
    if (
      !data.phone.trim() ||
      !data.password.trim() ||
      !data.passwordConfirm.trim()
    ) {
      Swal.fire({
        title: "Đăng ký thất bại",
        text: "Vui lòng điền đầy đủ thông tin",
        icon: "warning",
        confirmButtonColor: "#3B82F6",
      });
      return;
    }

    // Kiểm tra khớp mật khẩu
    if (data.password !== data.passwordConfirm) {
      Swal.fire({
        title: "Đăng ký thất bại",
        text: "Mật khẩu nhập lại không khớp",
        icon: "error",
        confirmButtonColor: "#EF4444",
      });
      return;
    }

    const res = await register({ phone: data.phone, password: data.password });

    if (res.err === 0) {
      Swal.fire({
        title: "Thành công!",
        text: res.message || "Tạo tài khoản thành công",
        icon: "success",
        showConfirmButton: false,
        timer: 1500,
      });
      navigate(LOGIN);
    } else {
      Swal.fire({
        title: "Đăng ký thất bại",
        text: res.message || "Đã có lỗi xảy ra",
        icon: "error",
        confirmButtonColor: "#EF4444",
      });
    }
  };

  const handleOnChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  return (
    <div
      className="min-h-screen bg-no-repeat bg-center bg-cover relative flex items-center justify-center lg:justify-start w-full py-10"
      style={{ backgroundImage: `url(${bg_image})` }}
    >
      {/* Lớp phủ làm tối nền nhẹ */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]"></div>

      <div className="relative z-10 bg-white/95 backdrop-blur-md w-[90%] sm:w-[400px] lg:ml-[10%] rounded-br-[40px] rounded-tl-[40px] shadow-2xl p-8 sm:p-10 flex flex-col gap-6 transition-all">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <h2 className="font-bold text-3xl text-gray-800 tracking-tight">
            Đăng ký
          </h2>
          <p className="text-gray-500 text-sm">Tạo tài khoản mới để tiếp tục</p>
        </div>

        {/* Form Fields */}
        <div className="flex flex-col gap-4">
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
              value={data.phone}
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
                value={data.password}
                onChange={handleOnChange}
              />
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

          {/* Nhập lại mật khẩu */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="passwordConfirm"
              className="text-sm font-medium text-gray-700"
            >
              Nhập lại mật khẩu
            </label>
            <div className="relative">
              <input
                id="passwordConfirm"
                name="passwordConfirm"
                className="w-full border border-gray-300 rounded-lg pl-4 pr-11 py-2.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Xác nhận lại mật khẩu"
                value={data.passwordConfirm}
                onChange={handleOnChange}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <FaRegEyeSlash size={18} />
                ) : (
                  <FaRegEye size={18} />
                )}
              </button>
            </div>

            {/* Link Đăng nhập */}
            <div className="flex justify-end mt-1">
              <p
                className="text-sm font-medium text-blue-600 hover:text-blue-800 cursor-pointer transition-colors"
                onClick={() => navigate(LOGIN)}
              >
                Bạn đã có tài khoản? Đăng nhập
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-4 mt-2">
          <button
            className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-semibold text-lg py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
            onClick={handleRegister}
          >
            Đăng ký
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

export default Register;
