import React, { useState } from "react";
import logo from "../../assets/logo.png";
import {
  APPOINTMENTSCHEDULE,
  LOGIN_RECEPTIONIST,
  OVERVIEW,
  PATIENT,
  SETTING_ACCOUNT,
  CREATE_APPOINTMENT,
  RECEPTIONIST_CHAT,
} from "../../utils/path";
import { IoLogOut } from "react-icons/io5";
import { useLocation, useNavigate } from "react-router-dom";
import { logoutReceptionistRedux } from "../../redux/authReceptionistSlice";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const menuItems = [
    { id: "overview", label: "Tổng quan", icon: "📊", path: OVERVIEW },
    {
      id: "appointments",
      label: "Lịch hẹn",
      icon: "📅",
      path: APPOINTMENTSCHEDULE,
    },
    {
      id: "create-appointment",
      label: "Tạo lịch hẹn",
      icon: "📝",
      path: CREATE_APPOINTMENT,
    },
    { id: "patients", label: "Bệnh nhân", icon: "👥", path: PATIENT },
    { id: "chat", label: "Chat", icon: "💬", path: RECEPTIONIST_CHAT },
    {
      id: "settings",
      label: "Cài đặt tài khoản",
      icon: "⚙️",
      path: SETTING_ACCOUNT,
    },
  ];

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
        const res = await dispatch(logoutReceptionistRedux());
        if (res.payload.error === 0) {
          Swal.fire({
            title: "Hẹn gặp lại!",
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
          });
          navigate(`/${LOGIN_RECEPTIONIST}`);
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
    <div className="w-[260px] h-screen bg-white border-r border-gray-200 flex flex-col fixed left-0 top-0 shadow-sm font-sans">
      {/* Header / Logo */}
      <div className="px-5 py-6 border-b border-gray-200 flex items-center gap-3">
        <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center p-1 overflow-hidden transition-transform group-hover:scale-105">
          <img
            className="object-cover h-full w-full"
            src={logo}
            alt="Nger Admin"
          />
        </div>
        <h2 className="text-2xl font-bold font-Lobster text-blue-700 tracking-wide ">
          Lễ tân
        </h2>
      </div>

      {/* Menu List */}
      <ul className="list-none p-0 my-5 flex flex-col gap-2">
        {menuItems.map((item) => {
          return (
            <li
              key={item.id}
              onClick={() => {
                navigate(item.path);
              }}
              className={`py-3 px-5 mx-3 flex items-center cursor-pointer rounded-lg transition-colors duration-200 ${
                item.path === location.pathname.split("/").pop()
                  ? "bg-blue-50 text-blue-700 font-semibold"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <span className="mr-3 text-xl">{item.icon}</span>
              <span className="text-[15px]">{item.label}</span>
            </li>
          );
        })}
        <li
          className={`py-3 px-5 mx-3 flex items-center cursor-pointer rounded-lg transition-colors duration-200 text-gray-600 hover:bg-gray-100 hover:text-gray-900`}
          onClick={handleClickLogout}
        >
          <span className="mr-3 text-xl">
            <IoLogOut />
          </span>
          <span className="text-[15px]">Đăng xuất</span>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
