import logo from "../../assets/logo.png";
import { HiOutlineUserCircle } from "react-icons/hi2";
import { ImUser } from "react-icons/im";
import { FaLock } from "react-icons/fa";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { loginDoctorRedux } from "../../redux/authDoctorSlice";
import { useNavigate } from "react-router-dom";
import { DOCTOR, MY_APPOINTMENT } from "../../utils/path";
import Swal from "sweetalert2";

function LoginDoctor() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [payload, setPayload] = useState({
    phone: "",
    password: "",
  });

  const handleSetOnchange = (e) => {
    const { name, value } = e.target;
    setPayload((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleClickLogin = async () => {
    if (payload.phone === "" || payload.password === "") {
      Swal.fire({
        title: "Đăng nhập thất bại",
        text: "Vui lòng nhập đầy đủ thông tin",
        icon: "warning",
        confirmButtonColor: "#2563EB",
      });
      return;
    }

    const res = await dispatch(loginDoctorRedux(payload));
    if (res.payload?.error === 0) {
      navigate(`/${DOCTOR}/${MY_APPOINTMENT}`);
    } else {
      Swal.fire({
        title: "Đăng nhập thất bại",
        text: res.payload?.message,
        icon: "error",
        confirmButtonColor: "#DC2626",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex flex-col font-sans text-slate-800">
      {/* Header / Logo */}
      <header className="p-6 flex items-center gap-3">
        <div className="h-12 w-12 rounded-full shadow-sm bg-white p-1 overflow-hidden flex items-center justify-center">
          <img className="object-cover h-full w-full" src={logo} alt="Logo" />
        </div>
        <span className="text-2xl font-bold text-blue-700 font-Lobster tracking-wide">
          Nger Doctor
        </span>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-8 border border-slate-100 transition-all">
          {/* Form Header */}
          <div className="flex flex-col items-center mb-8">
            <div className="bg-blue-100 p-4 rounded-full mb-4 text-blue-600 shadow-inner">
              <HiOutlineUserCircle size={"3.5rem"} />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">
              Cổng Đăng Nhập
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              Dành cho Bác sĩ & Nhân viên y tế
            </p>
          </div>

          {/* Inputs */}
          <div className="space-y-5">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <ImUser className="text-slate-400" size={"1.1rem"} />
              </div>
              <input
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-300"
                placeholder="Số điện thoại / Tên đăng nhập"
                name="phone"
                value={payload.phone}
                onChange={handleSetOnchange}
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FaLock className="text-slate-400" size={"1.1rem"} />
              </div>
              <input
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-300"
                placeholder="Mật khẩu"
                type="password"
                name="password"
                value={payload.password}
                onChange={handleSetOnchange}
              />
            </div>
          </div>

          {/* Action Button */}
          <button
            className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 active:scale-[0.98] flex justify-center items-center"
            onClick={handleClickLogin}
          >
            Đăng nhập
          </button>

          {/* Footer Links */}
          <div className="mt-6 text-center">
            <span className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline cursor-pointer transition-colors">
              Bạn quên mật khẩu?
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}

export default LoginDoctor;
