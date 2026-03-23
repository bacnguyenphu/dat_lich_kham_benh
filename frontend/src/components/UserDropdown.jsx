import { Link, useNavigate } from "react-router-dom";
import defaultAvatar from "../assets/defaultAvatar.png";
import { CiUser } from "react-icons/ci";
import { IoIosLogOut } from "react-icons/io";
import { RxCountdownTimer } from "react-icons/rx";
import { FaCaretDown } from "react-icons/fa6";
import { GrUserAdmin } from "react-icons/gr";
import { useEffect, useRef, useState } from "react";
import { ADMIN, APPOINTMENT, PROFILE, STATISTICAL } from "../utils/path";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { logoutUser } from "../redux/authSlice";
import { requestNavigateAdmin } from "../services/authService";

function UserDropdown() {
  const modalUser = useRef();
  const [showModal, setShowModal] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalUser.current && !modalUser.current.contains(event.target)) {
        setShowModal(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const navs = [
    {
      title: "Thông tin cá nhân",
      icon: <CiUser size={"1.4rem"} />,
      path: PROFILE,
    },
    {
      title: "Lịch hẹn của tôi",
      icon: <RxCountdownTimer size={"1.4rem"} />,
      path: APPOINTMENT,
    },
  ];

  const handleClickLogout = () => {
    setShowModal(false);
    Swal.fire({
      title: "Đăng xuất tài khoản?",
      text: "Bạn có chắc chắn muốn đăng xuất khỏi hệ thống?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#94A3B8",
      confirmButtonText: "Đăng xuất",
      cancelButtonText: "Hủy bỏ",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = await dispatch(logoutUser());
        if (res.payload.error === 0) {
          navigate("/");
        } else {
          Swal.fire({
            title: "Đăng xuất thất bại!",
            text: res.payload.message || "Đã có lỗi xảy ra",
            icon: "error",
            confirmButtonColor: "#3B82F6",
          });
        }
      }
    });
  };

  const handleClickNavigateAdmin = async () => {
    setShowModal(false);
    try {
      const res = await requestNavigateAdmin();
      if (res.err === 0) {
        navigate(`${ADMIN}/${STATISTICAL}`);
      } else {
        Swal.fire({
          title: "Lỗi truy cập",
          text: res.message || "Có lỗi xảy ra",
          icon: "error",
          confirmButtonColor: "#3B82F6",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Từ chối truy cập",
        text:
          error.response?.data?.message ||
          "Bạn không có quyền truy cập trang này",
        icon: "error",
        confirmButtonColor: "#3B82F6",
      });
    }
  };

  return (
    <div ref={modalUser} className="relative">
      <div
        className="flex items-center gap-2.5 cursor-pointer p-1.5 pr-3 rounded-full hover:bg-slate-100 transition-colors select-none group"
        onClick={() => setShowModal(!showModal)}
      >
        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm ring-2 ring-transparent group-hover:ring-blue-100 transition-all">
          <img
            src={auth?.data?.avatar ? auth?.data?.avatar : defaultAvatar}
            alt="Avatar"
            className="w-full h-full object-center object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = defaultAvatar;
            }}
          />
        </div>
        <div className="hidden sm:flex flex-col items-start">
          <p className="font-bold text-sm text-slate-700 leading-tight">
            {auth?.data?.firstName} {auth?.data?.lastName}
          </p>
        </div>
        <FaCaretDown
          className={`text-slate-400 transition-transform duration-300 ${showModal ? "rotate-180" : ""}`}
          size={"1.2rem"}
        />
      </div>

      {showModal && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-100 z-[100] overflow-hidden animate-[fadeIn_0.15s_ease-out]">
          <div className="bg-slate-50 p-4 border-b border-slate-100 flex items-center gap-4">
            <div className="w-14 h-14 rounded-full overflow-hidden border border-slate-200 shrink-0">
              <img
                className="object-cover object-center w-full h-full"
                alt="User Avatar"
                src={auth?.data?.avatar || defaultAvatar}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = defaultAvatar;
                }}
              />
            </div>
            <div className="flex flex-col justify-center overflow-hidden">
              <span className="text-base font-bold text-slate-800 truncate">
                {auth?.data?.firstName} {auth?.data?.lastName}
              </span>
              <span className="text-xs font-medium text-slate-500 truncate mt-0.5">
                {auth?.data?.phone || "Chưa cập nhật SĐT"}
              </span>
            </div>
          </div>

          <div className="p-2">
            {navs.map((nav, index) => (
              <Link
                to={nav.path}
                key={`nav-menu-${index}`}
                onClick={() => setShowModal(false)}
              >
                <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-blue-50 text-slate-600 hover:text-blue-600 transition-colors cursor-pointer mb-1 group">
                  <span className="text-slate-400 group-hover:text-blue-500 transition-colors">
                    {nav.icon}
                  </span>
                  <span className="font-semibold text-[15px]">{nav.title}</span>
                </div>
              </Link>
            ))}

            {auth?.data?.role === "R1" && (
              <>
                <div className="h-px bg-slate-100 my-1 mx-2"></div>
                <div
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-purple-50 text-slate-600 hover:text-purple-700 transition-colors cursor-pointer mb-1 group"
                  onClick={handleClickNavigateAdmin}
                >
                  <span className="text-slate-400 group-hover:text-purple-600 transition-colors">
                    <GrUserAdmin size={"1.3rem"} />
                  </span>
                  <span className="font-semibold text-[15px]">
                    Quản trị viên hệ thống
                  </span>
                </div>
              </>
            )}

            <div className="h-px bg-slate-100 my-1 mx-2"></div>

            <div
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-50 text-slate-600 hover:text-red-600 transition-colors cursor-pointer group"
              onClick={handleClickLogout}
            >
              <span className="text-slate-400 group-hover:text-red-500 transition-colors">
                <IoIosLogOut size={"1.4rem"} />
              </span>
              <span className="font-semibold text-[15px]">Đăng xuất</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserDropdown;
