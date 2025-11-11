import { useEffect, useState } from "react";
import { useSelector } from 'react-redux'
import { useLocation, useNavigate } from "react-router-dom";
import { getAppointmentOfUserFollowDoctor } from "../../services/doctorService";
import { GoDotFill } from "react-icons/go";

import dayjs from 'dayjs';
import 'dayjs/locale/vi';
dayjs.locale('vi')

function AppointmentsOfPatient({ setIsShow }) {

    const [appointments, setAppointments] = useState([])
    const navigate = useNavigate()

    const authDoctor = useSelector(state => state.authDoctor?.data?.id)
    const location = useLocation()
    const query = new URLSearchParams(location.search)
    const idUser = query.get("id_patient")

    useEffect(() => {
        const fetchData = async () => {
            const res = await getAppointmentOfUserFollowDoctor(idUser, authDoctor)
            if (res.err === 0) {
                setAppointments(res.data)
            }
        }
        if (idUser) {
            fetchData()
        }
    }, [idUser])

    const handleClickClose = () => {
        setIsShow(false)
        navigate(location.pathname)
    }

    return (
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-black/40 animate-fade-in"
            onClick={(e) => {
                if (e.target === e.currentTarget) {
                    handleClickClose()
                }
            }}>
            <div className="bg-white h-screen w-3/12 animate-slide-right">
                <h4 className="px-5 py-4 font-semibold border-b border-gray-400">Xem chi tiết lịch dã khám của bênh nhân </h4>
                <div>
                    {appointments.length > 0 &&
                        appointments.map(appointment => {
                            return (
                                <div key={appointment.id} className="flex gap-2 border-b border-b-gray-300 px-2 py-4 mt-5">
                                    <div><GoDotFill className="mt-1"/></div>
                                    <div>
                                        <div className="flex items-center gap-1">
                                            <span>Ngày khám: </span>
                                            <span>{dayjs(appointment.appointment_date).format('DD/MM/YYYY')}</span>
                                        </div>
                                        <div>
                                            <span>Giờ khám: </span>
                                            <span>{appointment?.time}</span>
                                        </div>
                                    </div>

                                </div>
                            )
                        })
                    }
                </div>
            </div>

        </div>
    );
}

export default AppointmentsOfPatient;