import logo from "../../assets/logo.png";
import { HiOutlineUserCircle } from "react-icons/hi2";
import { ImUser } from "react-icons/im";
import { FaLock } from "react-icons/fa";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { loginReceptionistRedux } from "../../redux/authReceptionistSlice";
import { OVERVIEW, RECEPTIONIST } from "../../utils/path";

function LoginReceptionist() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [payload, setPayload] = useState({
    phone: "",
    password: "",
  });

  const handleSetOnchange = (e) => {
    const { name, value } = e.target;
    setPayload((prev) => ({ ...prev, [name]: value }));
  };

  const handleClickLogin = async () => {
    if (payload.phone === "" || payload.password === "") {
      Swal.fire({
        title: "Thiếu thông tin",
        text: "Vui lòng nhập đầy đủ số điện thoại và mật khẩu",
        icon: "warning",
        confirmButtonColor: "#3B82F6",
      });
      return;
    }

    setIsLoading(true);
    const res = await dispatch(loginReceptionistRedux(payload));
    console.log("check res: ", res);

    setIsLoading(false);

    if (res.payload?.error === 0) {
      if (res.payload?.data?.role === "R4") {
        navigate(`/${RECEPTIONIST}/${OVERVIEW}`);
        Swal.fire({
          title: "Đăng nhập thành công",
          text: `Chào mừng lễ tân ${res.payload?.data?.firstName} ${res.payload?.data?.lastName}!`,
          icon: "success",
          confirmButtonColor: "#3B82F6",
        });
      } else {
        Swal.fire({
          title: "Truy cập bị từ chối",
          text: "Tài khoản này không có quyền truy cập cổng Lễ tân",
          icon: "error",
          confirmButtonColor: "#EF4444",
        });
      }
    } else {
      Swal.fire({
        title: "Lỗi đăng nhập",
        text: res.payload?.message || "Thông tin tài khoản không chính xác",
        icon: "error",
        confirmButtonColor: "#EF4444",
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      {/* Brand Logo */}
      <div className="absolute top-8 left-8 flex items-center gap-3 cursor-pointer group">
        <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center p-2 group-hover:scale-110 transition-transform">
          <img
            src={logo}
            alt="Nger Clinic Logo"
            className="object-contain w-full h-full"
          />
        </div>
        <p className="text-xl font-bold font-Lobster text-slate-800">
          Nger Clinic
        </p>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-[420px] bg-white rounded-[2rem] shadow-xl shadow-slate-200/60 p-8 sm:p-10 border border-slate-100 animate-[fadeIn_0.3s_ease-out]">
        {/* Header Section */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4">
            <HiOutlineUserCircle size="3.5rem" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-800">
            Cổng Lễ Tân
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Đăng nhập để quản lý bệnh nhân
          </p>
        </div>

        {/* Form Fields */}
        <div className="space-y-5">
          {/* Phone Input */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
              Số điện thoại
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                <ImUser size="1.1rem" />
              </div>
              <input
                type="text"
                name="phone"
                placeholder="Nhập số điện thoại..."
                onChange={handleSetOnchange}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 pl-11 pr-4 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all text-slate-700 font-medium"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
              Mật khẩu
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                <FaLock size="1rem" />
              </div>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                onChange={handleSetOnchange}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 pl-11 pr-4 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all text-slate-700 font-medium"
              />
            </div>
          </div>
        </div>

        {/* Login Button */}
        <button
          onClick={handleClickLogin}
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-200 mt-10 transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <AiOutlineLoading3Quarters className="animate-spin" size="1.4rem" />
          ) : (
            "Tiếp tục"
          )}
        </button>

        {/* Footer Links */}
        <div className="mt-8 flex flex-col items-center gap-2">
          <button className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">
            Quên mật khẩu?
          </button>
          <button
            onClick={() => navigate(HOMEPAGE)}
            className="text-sm font-medium text-slate-400 hover:text-slate-600 transition-colors mt-2"
          >
            Quay về trang chủ
          </button>
        </div>
      </div>

      <p className="mt-8 text-slate-400 text-xs font-medium">
        &copy; 2026 Nger Clinic Management System
      </p>
    </div>
  );
}

export default LoginReceptionist;
