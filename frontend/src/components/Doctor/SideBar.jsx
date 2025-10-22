import { MdSchedule } from "react-icons/md";
import { CiUser } from "react-icons/ci";
import { CiCircleInfo } from "react-icons/ci";
import { AiOutlineSchedule } from "react-icons/ai";
import { TbLockPassword } from "react-icons/tb";
import { CiLogout } from "react-icons/ci";
import { NavLink } from "react-router-dom";
import { CHANGE_PASSWORD, MY_APPOINTMENT, MY_INFORMATION, MY_PATIENT, MY_SCHEDULE } from "../../utils/path";

function SideBar() {

    const classNoActive = "flex gap-3 items-center border border-gray-300 px-5 py-3 cursor-pointer"
    const classActive = "flex gap-3 items-center border border-primary-50 bg-primary-50 text-white px-5 py-3 cursor-pointer"

    return (
        <div className="flex flex-col gap-3">
            <NavLink to={MY_APPOINTMENT} className={({isActive}) => {
                return isActive ? classActive : classNoActive
            }}>
                <MdSchedule size={"1.5rem"} />
                <p>Lịch hẹn của tôi</p>
            </NavLink>
            <NavLink to={MY_PATIENT} className={({isActive}) => {
                return isActive ? classActive : classNoActive
            }}>
                <CiUser size={"1.5rem"} />
                <p>Bệnh nhân của tôi</p>
            </NavLink>
            <NavLink to={MY_INFORMATION} className={({isActive}) => {
                return isActive ? classActive : classNoActive
            }}>
                <CiCircleInfo size={"1.5rem"} />
                <p>Thông tin của tôi</p>
            </NavLink>
            <NavLink to={MY_SCHEDULE} className={({isActive})=>{
                return isActive?classActive:classNoActive
            }}>
                <AiOutlineSchedule size={"1.5rem"} />
                <p>Lịch trình của tôi</p>
            </NavLink>
            <NavLink to={CHANGE_PASSWORD} className={({isActive})=>{
                return isActive?classActive:classNoActive
            }}>
                <TbLockPassword size={"1.5rem"} />
                <p>Đổi mật khẩu</p>
            </NavLink>
            <div className="flex gap-3 items-center border border-gray-300 px-5 py-3 cursor-pointer">
                <CiLogout size={"1.5rem"} />
                <p>Đăng xuất</p>
            </div>
        </div>
    );
}

export default SideBar;