import { MdSchedule } from "react-icons/md";
import { CiUser, CiCircleInfo, CiLogout } from "react-icons/ci";
import { AiOutlineSchedule } from "react-icons/ai";
import { TbLockPassword } from "react-icons/tb";
import { NavLink, useNavigate } from "react-router-dom";
import {
  CHANGE_PASSWORD,
  LOGIN_DOCTOR,
  MY_APPOINTMENT,
  MY_INFORMATION,
  MY_PATIENT,
  MY_SCHEDULE,
} from "../../utils/path";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import { logoutDoctor } from "../../redux/authDoctorSlice";

function SideBar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Định nghĩa class cho NavLink
  const navLinkClass = ({ isActive }) => `
        flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-200 group
        ${
          isActive
            ? "bg-blue-50 text-blue-600 font-bold shadow-sm border-l-4 border-blue-600 rounded-l-none"
            : "text-slate-500 hover:bg-slate-50 hover:text-slate-800 font-medium"
        }
    `;

  const handleClickLogout = async () => {
    Swal.fire({
      title: "Xác nhận đăng xuất?",
      text: "Bạn sẽ cần đăng nhập lại để tiếp tục làm việc.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3B82F6",
      cancelButtonColor: "#94A3B8",
      confirmButtonText: "Đăng xuất ngay",
      cancelButtonText: "Hủy",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = await dispatch(logoutDoctor());
        if (res.payload.error === 0) {
          Swal.fire({
            title: "Hẹn gặp lại!",
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
          });
          navigate(`/${LOGIN_DOCTOR}`);
        } else {
          Swal.fire({
            title: "Lỗi!",
            text: "Không thể đăng xuất vào lúc này.",
            icon: "error",
          });
        }
      }
    });
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/60 shadow-sm p-4 flex flex-col gap-2 min-h-[500px]">
      {/* Group chính */}
      <div className="flex flex-col gap-1">
        <p className="px-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-3 mt-2">
          Quản lý công việc
        </p>

        <NavLink to={MY_APPOINTMENT} className={navLinkClass}>
          <MdSchedule size={"1.4rem"} />
          <span>Lịch hẹn của tôi</span>
        </NavLink>

        <NavLink to={MY_PATIENT} className={navLinkClass}>
          <CiUser size={"1.4rem"} />
          <span>Bệnh nhân của tôi</span>
        </NavLink>

        <NavLink to={MY_SCHEDULE} className={navLinkClass}>
          <AiOutlineSchedule size={"1.4rem"} />
          <span>Lịch trình làm việc</span>
        </NavLink>
      </div>

      {/* Group Tài khoản */}
      <div className="flex flex-col gap-1 mt-6">
        <p className="px-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-3">
          Cài đặt hệ thống
        </p>

        <NavLink to={MY_INFORMATION} className={navLinkClass}>
          <CiCircleInfo size={"1.4rem"} />
          <span>Thông tin của tôi</span>
        </NavLink>

        <NavLink to={CHANGE_PASSWORD} className={navLinkClass}>
          <TbLockPassword size={"1.4rem"} />
          <span>Đổi mật khẩu</span>
        </NavLink>

        <div
          className="flex items-center gap-4 px-6 py-4 rounded-2xl text-slate-500 hover:bg-red-50 hover:text-red-500 transition-all duration-200 cursor-pointer mt-4 border-t border-slate-50 pt-6"
          onClick={handleClickLogout}
        >
          <CiLogout size={"1.4rem"} />
          <span className="font-medium">Đăng xuất</span>
        </div>
      </div>
    </div>
  );
}

export default SideBar;
