import { useNavigate } from "react-router-dom";
import { HOMEPAGE } from "../utils/path";
import { GoHome } from "react-icons/go";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { getAppointmentOfUser, updateStatusAppointment } from "../services/appointment";
import { useState } from "react";
import { InfoAppointment } from "../components";
import { IoClose } from "react-icons/io5";
import { GiSandsOfTime } from "react-icons/gi";
import { FaCheck } from "react-icons/fa6";
import { FaRegCheckCircle, FaRegTrashAlt } from "react-icons/fa";
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { toast } from "react-toastify";
import Swal from "sweetalert2";

function ListAppointmenT() {

    const navigate = useNavigate()
    const idUser = useSelector(state => state?.auth?.data?.id)
    const [infoAppointments, setInfoAppointment] = useState([])

    const fetchAppointment = async () => {
        const res = await getAppointmentOfUser(idUser)
        if (res.err === 0 && res?.data) {
            let data = res.data.map(item => {
                if (item?.doctor) {
                    return {
                        id: item.id,
                        status: item.status,
                        name: item?.doctor?.position.map(item => item.name).join(" ") + " " + item?.doctor?.user?.firstName + item?.doctor?.user?.lastName,
                        price: item?.doctor?.price.toLocaleString('vi-VN'),
                        image: item?.doctor?.user?.avatar,
                        time_frame: item?.time,
                        appointment_date: item?.appointment_date,
                    }
                }
                if (item?.medical_package) {
                    return {
                        id: item.id,
                        status: item.status,
                        name: item?.medical_package?.name,
                        price: item?.medical_package?.price,
                        image: item?.medical_package?.image,
                        time_frame: item?.time,
                        appointment_date: item?.appointment_date,
                    }
                }
            })
            setInfoAppointment(data)
        }
    }
    useEffect(() => {
        if (idUser) {
            fetchAppointment()
        }

    }, [idUser])

    const handleClickCancelAppointment = async (idAppointmemt) => {
        if (idAppointmemt) {
            Swal.fire({
                title: "Bạn chắc muốn hủy lịch khám ?",
                showDenyButton: true,
                confirmButtonText: "Hủy",
                denyButtonText: "Thoát"
            }).then(async (result) => {
                if (result.isConfirmed) {
                    const res = await updateStatusAppointment(idAppointmemt, 0)
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
    }

    return (
        <div className="lg:px-40 md:px-20 px-5 py-5">
            <div className="flex items-center">
                <span className="cursor-pointer"
                    onClick={() => { navigate(HOMEPAGE) }}
                >
                    <GoHome color="#00A2A1" size={'1.25rem'} />
                </span>
                <span>/</span>
                <span className="ml-2">Lịch hẹn khám</span>
            </div>
            <div className=" lg:px-40 md:px-20 px-4 mt-10">
                {infoAppointments.length > 0 &&
                    infoAppointments.map(item => {
                        const { id, status, ...other } = item

                        return (
                            <div key={id} className="border border-gray-400 rounded-xl px-5 py-10 mb-5">
                                <div className="flex items-center justify-between">
                                    <InfoAppointment infoAppointment={other} />
                                    {(status === 1 || status === 2) &&
                                        <Tippy content="Hủy lịch khám">
                                            <span onClick={() => {
                                                handleClickCancelAppointment(id)
                                            }}>
                                                <IoClose size={'2rem'} className="text-gray-400 cursor-pointer" />
                                            </span>
                                        </Tippy>
                                    }
                                </div>
                                {status === 1 &&
                                    <span className="text-yellow-500 flex items-center justify-center py-1 px-2 rounded-xl gap-2 border border-yellow-500 w-fit mt-5 ml-32" >
                                        <GiSandsOfTime />
                                        <label className="text-sm">Chờ xác nhận</label>
                                    </span>
                                }
                                {status === 2 &&
                                    <span className="text-blue-500 flex items-center justify-center py-1 px-2 rounded-xl gap-2 border border-blue-500 w-fit mt-5 ml-32" >
                                        <FaCheck />
                                        <label className="text-sm">Xác nhận</label>
                                    </span>
                                }
                                {status === 3 &&
                                    <span className="text-green-500 flex items-center justify-center py-1 px-2 rounded-xl gap-2 border border-green-500 w-fit mt-5 ml-32" >
                                        <FaRegCheckCircle />
                                        <label className="text-sm">Đã khám xong</label>
                                    </span>
                                }
                                {status === 0 &&
                                    <span className="text-red-500 flex items-center justify-center py-1 px-2 rounded-xl gap-2 border border-red-500 w-fit mt-5 ml-32" >
                                        <FaRegTrashAlt />
                                        <label className="text-sm">Đã hủy</label>
                                    </span>
                                }
                            </div>
                        )
                    })
                }
            </div>
        </div >
    );
}

export default ListAppointmenT;