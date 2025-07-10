import { NavLink, useLocation } from 'react-router-dom';
import logo from '../../assets/logo.png'
import {
    FaUserDoctor, FaAngleDown, FaCircleInfo, FaPaperPlane,
    FaBookMedical, FaChartSimple, FaFire, FaHouse, FaUserGroup
} from "react-icons/fa6";
import { FaFileMedicalAlt } from "react-icons/fa";
import { RxCountdownTimer } from "react-icons/rx";
import {
    INFORMATION_DOCTOR, MANAGE_APPOINTMENT, MANAGE_DOCTOR, MANAGE_MEDICAL,
    MANAGE_PACKAGE,
    MANAGE_POSITION, MANAGE_SPECIALTY, MANAGE_USERS, MEDICAL_EXAMINATION_PLAN,
    STATISTICAL
} from '../../utils/path';
import { useState } from 'react';

function Sidebar() {

    const classActive = 'relative after:absolute after:w-1 after:bg-primary-50 after:h-full after:left-0 after:top-0 text-primary-50 font-semibold'

    const [isDownDoctor, setIsDownDoctor] = useState(false)
    const [isDownMedical, setIsDownMedical] = useState(false)

    const location = useLocation()

    const pathManage = location.pathname.split('/')[2]

    return (
        <div>
            <div className="flex gap-4 items-center pl-10 cursor-pointer py-2">
                <div className='h-[50px] w-[50px]'>
                    <img className='object-center object-cover size-full scale-125' src={logo} />
                </div>
                <p className='text-2xl font-semibold font-Lobster'>Nger Admin</p>
            </div>
            <div className='mt-5'>
                <NavLink
                    to={STATISTICAL}
                    className={({ isActive }) => {
                        return isActive ? classActive : ''
                    }}
                >
                    <div className='flex items-center h-12 gap-3 pl-10  '>
                        <span><FaHouse color="#00A2A1" size={'1.25rem'} /></span>
                        <p>Trang chủ</p>
                    </div>
                </NavLink>
                <div>
                    <div className={`${pathManage === MANAGE_DOCTOR ? classActive : ''}`}>
                        <div className='flex items-center justify-between h-12 px-10 cursor-pointer '
                            onClick={() => { setIsDownDoctor(!isDownDoctor) }}
                        >
                            <div className='flex items-center gap-3'>
                                <span><FaUserDoctor color="#00A2A1" size={'1.25rem'} /></span>
                                <p>Quản lí bác sĩ</p>
                            </div>
                            <div className={`${isDownDoctor ? 'rotate-180 duration-150' : 'rotate-0 duration-150'}`}>
                                <FaAngleDown color='black' />
                            </div>
                        </div>
                    </div>
                    <div className={`duration-300 overflow-hidden transition-all ${isDownDoctor ? 'max-h-24' : 'max-h-0'}`}>
                        <div>
                            <NavLink to={`${MANAGE_DOCTOR}/${INFORMATION_DOCTOR}`}
                                className={({ isActive }) => {
                                    return isActive ? "bg-primary-50/20 block" : ''
                                }}
                            >
                                <div className='flex items-center gap-3 pl-16 h-12 cursor-pointer'>
                                    <span><FaCircleInfo color="black" size={'1.25rem'} /></span>
                                    <p>Thông tin bác sĩ</p>
                                </div>

                            </NavLink>
                            <NavLink to={`${MANAGE_DOCTOR}/${MEDICAL_EXAMINATION_PLAN}`}
                                className={({ isActive }) => {
                                    return isActive ? "bg-primary-50/20 block" : ''
                                }}
                            >
                                <div className='flex items-center gap-3 pl-16 h-12 cursor-pointer'>
                                    <span><FaPaperPlane color="black" size={'1.25rem'} /></span>
                                    <p>Kế hoạch khám bệnh</p>
                                </div>
                            </NavLink>
                        </div>
                    </div>
                </div>
                <div>
                    <div className={`${pathManage === MANAGE_MEDICAL ? classActive : ''}`}>
                        <div className='flex items-center justify-between h-12 px-10 isDownMedical '
                            onClick={() => { setIsDownMedical(!isDownMedical) }}
                        >
                            <div className='flex items-center gap-3 cursor-pointer'>
                                <span><FaBookMedical color="#00A2A1" size={'1.25rem'} /></span>
                                <p>Quản lí y tế</p>
                            </div>
                            <div className={`${isDownMedical ? 'rotate-180 duration-150' : 'rotate-0 duration-150'}`}>
                                <FaAngleDown color='black' />
                            </div>
                        </div>
                    </div>
                    <div className={`duration-300 overflow-hidden transition-all ${isDownMedical ? 'max-h-36' : 'max-h-0'}`}>
                        <NavLink to={`${MANAGE_MEDICAL}/${MANAGE_SPECIALTY}`}
                            className={({ isActive }) => {
                                return isActive ? "bg-primary-50/20 block" : ''
                            }}
                        >
                            <div className='flex items-center gap-3 pl-16 h-12'>
                                <span><FaFire color="black" size={'1.25rem'} /></span>
                                <p>Chuyên khoa</p>
                            </div>
                        </NavLink>
                        <NavLink to={`${MANAGE_MEDICAL}/${MANAGE_POSITION}`}
                            className={({ isActive }) => {
                                return isActive ? "bg-primary-50/20 block" : ''
                            }}
                        >
                            <div className='flex items-center gap-3 pl-16 h-12'>
                                <span><FaChartSimple color="black" size={'1.25rem'} /></span>
                                <p>Chức vụ</p>
                            </div>

                        </NavLink>
                        <NavLink to={`${MANAGE_MEDICAL}/${MANAGE_PACKAGE}`}
                            className={({ isActive }) => {
                                return isActive ? "bg-primary-50/20 block" : ''
                            }}
                        >
                            <div className='flex items-center gap-3 pl-16 h-12'>
                                <span><FaFileMedicalAlt color="black" size={'1.25rem'} /></span>
                                <p>Gói khám</p>
                            </div>

                        </NavLink>
                    </div>
                </div>
                <NavLink
                    to={MANAGE_APPOINTMENT}
                    className={({ isActive }) => {
                        return isActive ? classActive : ''
                    }}
                >
                    <div className='flex items-center h-12 gap-3 pl-10  '>
                        <span><RxCountdownTimer color="#00A2A1" size={'1.25rem'} /></span>
                        <p>Lịch hẹn</p>
                    </div>
                </NavLink>
                <NavLink
                    to={MANAGE_USERS}
                    className={({ isActive }) => {
                        return isActive ? classActive : ''
                    }}
                >
                    <div className='flex items-center h-12 gap-3 pl-10  '>
                        <span><FaUserGroup color="#00A2A1" size={'1.25rem'} /></span>
                        <p>Quản lý khách hàng</p>
                    </div>
                </NavLink>
            </div>
        </div>
    );
}

export default Sidebar;