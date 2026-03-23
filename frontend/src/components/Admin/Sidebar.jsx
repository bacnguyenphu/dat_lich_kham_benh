import { NavLink, useLocation, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import {
  FaUserDoctor,
  FaAngleDown,
  FaCircleInfo,
  FaPaperPlane,
  FaBookMedical,
  FaChartSimple,
  FaFire,
  FaUserGroup,
} from "react-icons/fa6";
import { GrUserManager } from "react-icons/gr";
import { FaChartLine, FaFileMedicalAlt } from "react-icons/fa";
import { BiCategoryAlt } from "react-icons/bi";
import {
  ADMIN,
  CATEGORY_PACKAGE,
  HOMEPAGE,
  INFORMATION_DOCTOR,
  INFORMATION_PAKAGE,
  MANAGE_DOCTOR,
  MANAGE_MEDICAL,
  MANAGE_PACKAGE,
  MANAGE_POSITION,
  MANAGE_RECEPTIONIST,
  MANAGE_SPECIALTY,
  MANAGE_USERS,
  MEDICAL_EXAMINATION_PLAN,
  PACKAGE_PLAN,
  STATISTICAL,
} from "../../utils/path";
import { useState } from "react";

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const pathManage = location.pathname.split("/")[2];

  // States quản lý Dropdown
  const [isDownDoctor, setIsDownDoctor] = useState(
    pathManage === MANAGE_DOCTOR,
  );
  const [isDownMedical, setIsDownMedical] = useState(
    pathManage === MANAGE_MEDICAL,
  );
  const [isDownPackage, setIsDownPackage] = useState(
    pathManage === MANAGE_PACKAGE,
  );

  // CSS Class dùng chung
  const baseMenuClass =
    "flex items-center justify-between w-full px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 group select-none";
  const activeMenuClass = `${baseMenuClass} bg-blue-50 text-blue-700 font-bold`;
  const inactiveMenuClass = `${baseMenuClass} text-slate-600 hover:bg-slate-50 hover:text-blue-600 font-medium`;

  const baseSubMenuClass =
    "flex items-center gap-3 px-4 py-2.5 ml-4 rounded-xl cursor-pointer transition-all duration-200 text-[14px] select-none";
  const activeSubMenuClass = `${baseSubMenuClass} bg-blue-50/50 text-blue-600 font-bold`;
  const inactiveSubMenuClass = `${baseSubMenuClass} text-slate-500 hover:text-blue-600 hover:bg-slate-50 font-medium`;

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-4 min-h-[500px] h-full flex flex-col">
      {/* Header / Logo */}
      <div
        className="flex gap-3 items-center px-2 cursor-pointer pb-6 border-b border-slate-100 mb-4 group"
        onClick={() => navigate(HOMEPAGE)}
      >
        <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center p-1 overflow-hidden transition-transform group-hover:scale-105">
          <img
            className="object-cover h-full w-full"
            src={logo}
            alt="Nger Admin"
          />
        </div>
        <p className="text-2xl font-bold font-Lobster text-blue-700 tracking-wide mt-1">
          Nger Admin
        </p>
      </div>

      {/* Danh sách Menu */}
      <div className="flex flex-col gap-1.5 overflow-y-auto flex-1 custom-scrollbar pr-1">
        {/* === THỐNG KÊ === */}
        <NavLink
          to={`${ADMIN}/${STATISTICAL}`}
          className={({ isActive }) =>
            isActive || !pathManage ? activeMenuClass : inactiveMenuClass
          }
        >
          <div className="flex items-center gap-3">
            <FaChartLine className="text-inherit opacity-80" size={"1.25rem"} />
            <p>Bảng điều khiển</p>
          </div>
        </NavLink>

        {/* === QUẢN LÝ BÁC SĨ === */}
        <div>
          <div
            className={
              pathManage === MANAGE_DOCTOR ? activeMenuClass : inactiveMenuClass
            }
            onClick={() => setIsDownDoctor(!isDownDoctor)}
          >
            <div className="flex items-center gap-3">
              <FaUserDoctor
                className="text-inherit opacity-80"
                size={"1.25rem"}
              />
              <p>Quản lý bác sĩ</p>
            </div>
            <FaAngleDown
              className={`transition-transform duration-300 opacity-70 ${isDownDoctor ? "rotate-180" : "rotate-0"}`}
            />
          </div>

          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${isDownDoctor ? "max-h-[500px] opacity-100 mt-1" : "max-h-0 opacity-0"}`}
          >
            <div className="flex flex-col gap-1 border-l-2 border-slate-100 ml-6 pl-2">
              <NavLink
                to={`${MANAGE_DOCTOR}/${INFORMATION_DOCTOR}`}
                className={({ isActive }) =>
                  isActive ? activeSubMenuClass : inactiveSubMenuClass
                }
              >
                <FaCircleInfo
                  className="text-inherit opacity-70"
                  size={"1.1rem"}
                />
                <p>Thông tin bác sĩ</p>
              </NavLink>
              <NavLink
                to={`${MANAGE_DOCTOR}/${MEDICAL_EXAMINATION_PLAN}`}
                className={({ isActive }) =>
                  isActive ? activeSubMenuClass : inactiveSubMenuClass
                }
              >
                <FaPaperPlane
                  className="text-inherit opacity-70"
                  size={"1.1rem"}
                />
                <p>Kế hoạch khám</p>
              </NavLink>
            </div>
          </div>
        </div>

        {/* === QUẢN LÝ Y TẾ === */}
        <div>
          <div
            className={
              pathManage === MANAGE_MEDICAL
                ? activeMenuClass
                : inactiveMenuClass
            }
            onClick={() => setIsDownMedical(!isDownMedical)}
          >
            <div className="flex items-center gap-3">
              <FaBookMedical
                className="text-inherit opacity-80"
                size={"1.25rem"}
              />
              <p>Quản lý y tế</p>
            </div>
            <FaAngleDown
              className={`transition-transform duration-300 opacity-70 ${isDownMedical ? "rotate-180" : "rotate-0"}`}
            />
          </div>

          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${isDownMedical ? "max-h-[500px] opacity-100 mt-1" : "max-h-0 opacity-0"}`}
          >
            <div className="flex flex-col gap-1 border-l-2 border-slate-100 ml-6 pl-2">
              <NavLink
                to={`${MANAGE_MEDICAL}/${MANAGE_SPECIALTY}`}
                className={({ isActive }) =>
                  isActive ? activeSubMenuClass : inactiveSubMenuClass
                }
              >
                <FaFire className="text-inherit opacity-70" size={"1.1rem"} />
                <p>Chuyên khoa</p>
              </NavLink>
              <NavLink
                to={`${MANAGE_MEDICAL}/${MANAGE_POSITION}`}
                className={({ isActive }) =>
                  isActive ? activeSubMenuClass : inactiveSubMenuClass
                }
              >
                <FaChartSimple
                  className="text-inherit opacity-70"
                  size={"1.1rem"}
                />
                <p>Chức vụ</p>
              </NavLink>
            </div>
          </div>
        </div>

        {/* === GÓI KHÁM === */}
        <div>
          <div
            className={
              pathManage === MANAGE_PACKAGE
                ? activeMenuClass
                : inactiveMenuClass
            }
            onClick={() => setIsDownPackage(!isDownPackage)}
          >
            <div className="flex items-center gap-3">
              <FaFileMedicalAlt
                className="text-inherit opacity-80"
                size={"1.25rem"}
              />
              <p>Quản lý Gói khám</p>
            </div>
            <FaAngleDown
              className={`transition-transform duration-300 opacity-70 ${isDownPackage ? "rotate-180" : "rotate-0"}`}
            />
          </div>

          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${isDownPackage ? "max-h-[500px] opacity-100 mt-1" : "max-h-0 opacity-0"}`}
          >
            <div className="flex flex-col gap-1 border-l-2 border-slate-100 ml-6 pl-2">
              <NavLink
                to={`${MANAGE_PACKAGE}/${INFORMATION_PAKAGE}`}
                className={({ isActive }) =>
                  isActive ? activeSubMenuClass : inactiveSubMenuClass
                }
              >
                <FaCircleInfo
                  className="text-inherit opacity-70"
                  size={"1.1rem"}
                />
                <p>Thông tin gói khám</p>
              </NavLink>
              <NavLink
                to={`${MANAGE_PACKAGE}/${PACKAGE_PLAN}`}
                className={({ isActive }) =>
                  isActive ? activeSubMenuClass : inactiveSubMenuClass
                }
              >
                <FaPaperPlane
                  className="text-inherit opacity-70"
                  size={"1.1rem"}
                />
                <p>Kế hoạch gói khám</p>
              </NavLink>
              <NavLink
                to={`${MANAGE_PACKAGE}/${CATEGORY_PACKAGE}`}
                className={({ isActive }) =>
                  isActive ? activeSubMenuClass : inactiveSubMenuClass
                }
              >
                <BiCategoryAlt
                  className="text-inherit opacity-70"
                  size={"1.2rem"}
                />
                <p>Danh mục gói khám</p>
              </NavLink>
            </div>
          </div>
        </div>

        {/* === QUẢN LÝ LỄ TÂN === */}
        <NavLink
          to={`${ADMIN}/${MANAGE_RECEPTIONIST}`}
          className={({ isActive }) =>
            isActive ? activeMenuClass : inactiveMenuClass
          }
        >
          <div className="flex items-center gap-3">
            <GrUserManager
              className="text-inherit opacity-80"
              size={"1.25rem"}
            />
            <p>Quản lý lễ tân</p>
          </div>
        </NavLink>

        {/* === QUẢN LÝ KHÁCH HÀNG === */}
        <NavLink
          to={`${ADMIN}/${MANAGE_USERS}`}
          className={({ isActive }) =>
            isActive ? activeMenuClass : inactiveMenuClass
          }
        >
          <div className="flex items-center gap-3">
            <FaUserGroup className="text-inherit opacity-80" size={"1.25rem"} />
            <p>Quản lý khách hàng</p>
          </div>
        </NavLink>
      </div>
    </div>
  );
}

export default Sidebar;
