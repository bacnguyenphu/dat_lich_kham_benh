import { useEffect, useState } from "react";
import { FaCheck, FaRegEye } from "react-icons/fa6";
import { IoCheckmarkCircleSharp } from "react-icons/io5";
import { IoIosSearch } from "react-icons/io";
import { MdDeleteOutline } from "react-icons/md";
import { useSelector } from "react-redux";
import Pagination from "../../components/Pagination";
import { getAppointmentOfDoctor, updateStatusAppointment } from "../../services/appointment";

import dayjs from 'dayjs';
import { capitalizeFirstLetter } from "../../utils/capitalizeFirstLetter";
import { GiSandsOfTime } from "react-icons/gi";
import { FaRegCheckCircle, FaRegTrashAlt } from "react-icons/fa";
import { PiWarningCircleLight } from "react-icons/pi";
import { MdCheckBox } from "react-icons/md";
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import Swal from "sweetalert2";
import { toast } from "react-toastify";
dayjs.locale('vi')

function MyAppointment() {

    const authDoctor = useSelector(state => state?.authDoctor?.data)

    const [totalPages, setTotalPages] = useState(0)
    const limit = 5
    const [page, setPage] = useState(1)

    const [appointments, setAppointments] = useState([])

    // 99:Tat ca, 1: chờ xác nhận, 2: xác  nhận, 3 : đã xong, 0: đã huỷ
    const ALL = 99
    const CHO_XAC_NHAN = 1
    const XAC_NHAN = 2
    const DA_XONG = 3
    const DA_HUY = 0
    const [filter, setFilter] = useState(ALL)
    const [value, setValue] = useState('')
    const [debouncedValue, setDebouncedValue] = useState('')

    const fetchAppointment = async () => {
        const res = await getAppointmentOfDoctor(authDoctor?.id, limit, page, value, filter)
        if (res.err === 0) {
            setTotalPages(res?.totalPage)
            setAppointments(res?.data)
        }
    }

    useEffect(() => {
        fetchAppointment()
    }, [page, filter, debouncedValue])

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, 500); // chờ 0.5s sau khi ngừng gõ

        return () => clearTimeout(handler);
    }, [value])

    const handleUpdateStatusAppointment = async (idAppointmemt, status) => {
        if (idAppointmemt) {
            if (status === DA_HUY) {
                Swal.fire({
                    title: "Bạn chắc muốn hủy lịch khám ?",
                    showDenyButton: true,
                    confirmButtonText: "OK",
                    denyButtonText: "Thoát"
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        const res = await updateStatusAppointment(idAppointmemt, status)
                        if (res.err === 0) {
                            toast.success("Hủy thành công !")
                            await fetchAppointment()
                        }
                        else {
                            Swal.fire({
                                title: "Hủy lịch hẹn không thành công !",
                                icon: "error",
                            });
                        }
                    }
                });
            }
            else if (status === 2) {
                Swal.fire({
                    title: "Bạn muốn xác nhận lịch khám ?",
                    showDenyButton: true,
                    confirmButtonText: "OK",
                    denyButtonText: "Thoát"
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        const res = await updateStatusAppointment(idAppointmemt, status)
                        if (res.err === 0) {
                            toast.success("Xác nhận khám thành công !")
                            await fetchAppointment()
                        }
                        else {
                            Swal.fire({
                                title: "Xác nhận khám không thành công !",
                                icon: "error",
                            });
                        }
                    }
                });
            }
            else if (status === 3) {
                Swal.fire({
                    title: "Xác nhận khám xong cho bệnh nhân ?",
                    showDenyButton: true,
                    confirmButtonText: "OK",
                    denyButtonText: "Thoát"
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        const res = await updateStatusAppointment(idAppointmemt, status)
                        if (res.err === 0) {
                            toast.success("Xác nhận khám xong thành công !")
                            await fetchAppointment()
                        }
                        else {
                            Swal.fire({
                                title: "Xác nhận khám xong không thành công !",
                                icon: "error",
                            });
                        }
                    }
                });
            }
        }
    }

    return (
        <div>
            <h3 className="text-xl">Lịch khám của bác sĩ <span className="text-blue-800">Nguyễn Phú Bắc</span></h3>
            <div className="flex gap-7 items-center mt-5">
                <div className="flex items-center border border-gray-400 rounded-md grow overflow-hidden">
                    <input className="grow outline-none px-1" placeholder="Tìm kiếm bệnh nhân theo tên hoặc số điện thoại "
                        value={value} onChange={(e) => { setValue(e.target.value) }} />
                    <span className="p-2 bg-blue-700 h-full cursor-pointer"><IoIosSearch size={"1.5rem"} color="white" /></span>
                </div>
                <div>
                    <select className="border border-gray-400 p-2 rounded-md outline-none"
                        defaultValue={ALL}
                        onChange={(e) => { setFilter(e.target.value) }}>
                        <option value={ALL}>Tất cả</option>
                        <option value={CHO_XAC_NHAN}>Chờ xác nhận</option>
                        <option value={XAC_NHAN}>Xác nhận</option>
                        <option value={DA_XONG}>Đã xong</option>
                        <option value={DA_HUY}>Đã hủy</option>
                    </select>
                </div>
            </div>
            <div className="mt-5">
                {appointments.length > 0 ? <div className="relative flex flex-col w-full h-full text-gray-700 bg-white shadow-md rounded-lg bg-clip-border">
                    <table className="w-full text-left table-auto min-w-max">
                        <thead>
                            <tr className="border-b border-slate-300 bg-slate-50">
                                <th className="p-4 text-sm font-normal leading-none text-slate-500">STT</th>
                                <th className="p-4 text-sm font-normal leading-none text-slate-500">Bệnh nhân</th>
                                <th className="p-4 text-sm font-normal leading-none text-slate-500">Lịch hẹn</th>
                                <th className="p-4 text-sm font-normal leading-none text-slate-500 text-center">Trạng thái</th>
                                <th className="p-4 text-sm font-normal leading-none text-slate-500">Chức năng</th>
                            </tr>
                        </thead>
                        <tbody>
                            {appointments.length > 0 && appointments.map((appointment, index) => {
                                return (
                                    <tr className="hover:bg-slate-50" key={appointment.id}>
                                        <td className="p-3 border-b border-slate-200">
                                            <p className="block font-semibold text-sm text-slate-800">{(page - 1) * limit + index + 1}</p>
                                        </td>
                                        <td className="p-3 border-b border-slate-200">
                                            <p className="font-semibold text-sm text-slate-800 flex flex-col">
                                                <span>{appointment?.user?.firstName} {appointment?.user?.lastName}</span>
                                                <span className="font-light">SDT: {appointment?.user?.phone}</span>
                                            </p>
                                        </td>
                                        <td className="p-3 border-b border-slate-200">
                                            <p className="text-sm text-slate-800 flex flex-col">
                                                <span>{capitalizeFirstLetter(dayjs(`${appointment?.appointment_date}`).format("dddd - DD/MM/YYYY"))}</span>
                                                <span>{appointment?.time}</span>
                                            </p>
                                        </td>
                                        <td className="p-3 border-b border-slate-200">
                                            <p className="text-slate-500">
                                                <span className="flex items-center">
                                                    {appointment?.status === 1 &&
                                                        <span className="text-yellow-500 flex items-center justify-center py-1 px-2 rounded-xl gap-2 border border-yellow-500 w-fit mt-5" >
                                                            <GiSandsOfTime />
                                                            <label className="text-sm">Chờ xác nhận</label>
                                                        </span>
                                                    }
                                                    {appointment?.status === 2 &&
                                                        <span className="text-blue-500 flex items-center justify-center py-1 px-2 rounded-xl gap-2 border border-blue-500 w-fit mt-5" >
                                                            <FaCheck />
                                                            <label className="text-sm">Chờ khám</label>
                                                        </span>
                                                    }
                                                    {appointment?.status === 3 &&
                                                        <span className="text-green-500 flex items-center justify-center py-1 px-2 rounded-xl gap-2 border border-green-500 w-fit mt-5" >
                                                            <FaRegCheckCircle />
                                                            <label className="text-sm">Đã khám xong</label>
                                                        </span>
                                                    }
                                                    {appointment?.status === 0 &&
                                                        <span className="text-red-500 flex items-center justify-center py-1 px-2 rounded-xl gap-2 border border-red-500 w-fit mt-5" >
                                                            <FaRegTrashAlt />
                                                            <label className="text-sm">Đã hủy</label>
                                                        </span>
                                                    }
                                                    {!appointment?.payment_status ?
                                                        <span className="text-red-500 flex items-center justify-center py-1 px-2 rounded-xl gap-2 border border-red-500 w-fit mt-5 ml-5" >
                                                            <PiWarningCircleLight />
                                                            <label className="text-sm">Chưa thanh toán</label>
                                                        </span>
                                                        :
                                                        <span className="text-green-500 flex items-center justify-center py-1 px-2 rounded-xl gap-2 border border-green-500 w-fit mt-5 ml-5" >
                                                            <FaRegCheckCircle />
                                                            <label className="text-sm">Đã thanh toán</label>
                                                        </span>
                                                    }
                                                </span>
                                            </p>
                                        </td>
                                        <td className="p-3">
                                            <div className="flex items-center gap-4">
                                                {/* <Tippy content="Xem chi tiết">
                                                    <span className="cursor-pointer"><FaRegEye size={"1.25rem"} color="green" /></span>
                                                </Tippy> */}
                                                {(appointment?.status === 2 && appointment?.status !== 3) &&
                                                    <Tippy content="Xác nhận khám xong">
                                                        <span className="cursor-pointer"
                                                            onClick={() => { handleUpdateStatusAppointment(appointment.id, DA_XONG) }}>
                                                            <IoCheckmarkCircleSharp size={"1.25rem"} color="#2ecc71" />
                                                        </span>
                                                    </Tippy>
                                                }
                                                {(appointment?.status === 1 && appointment?.status !== 2) &&
                                                    <Tippy content="Xác nhận chờ khám">
                                                        <span className="cursor-pointer"
                                                            onClick={() => { handleUpdateStatusAppointment(appointment.id, XAC_NHAN) }}>
                                                            <MdCheckBox size={"1.25rem"} color="#3498db" />
                                                        </span>
                                                    </Tippy>
                                                }
                                                {(appointment?.status === 1 || appointment?.status === 2) &&
                                                    <Tippy content="Hủy lịch khám">
                                                        <span className="cursor-pointer"
                                                            onClick={() => { handleUpdateStatusAppointment(appointment.id, DA_HUY) }}>
                                                            <MdDeleteOutline size={"1.5rem"} color="red" />
                                                        </span>
                                                    </Tippy>
                                                }
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}

                        </tbody>
                    </table>
                </div>
                    :
                    <div>Không có lịch khám nào !</div>
                }
            </div>
            {appointments.length > 5 &&
                <div>
                    <Pagination setPage={setPage} totalPages={totalPages} />
                </div>}
        </div>
    );
}

export default MyAppointment;