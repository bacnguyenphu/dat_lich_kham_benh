import { useEffect, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { RiCalendarScheduleLine } from "react-icons/ri";
import { getScheduleFollowDate } from "../services/scheduleService";
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import { capitalizeFirstLetter } from "../utils/capitalizeFirstLetter";
dayjs.locale('vi')

function Schedules({idDoctor}) {

    const days = []

    for (let i = 0; i < 7; i++) {
        const date = {
            title: dayjs().add(i, 'day').format('dddd - DD/MM'),
            value: dayjs().add(i, 'day').format('YYYY-MM-DD'),
        }
        days.push(date)
    }

    const [selectedDate, setSelectedDate] = useState(days[0])
    const [timeFrames, setTimeFrames] = useState([])
    const [showModal, setShowModal] = useState(false)
    const [isClosing, setIsClosing] = useState(false)

    useEffect(() => {
        if (idDoctor !== null) {
            const fetchSchedule = async () => {
                const res = await getScheduleFollowDate({
                    id_doctor:idDoctor,
                    appointment_date: selectedDate.value
                })
                if (res.err === 0) {
                    setTimeFrames(res?.data?.time_frame)
                }
            }
            fetchSchedule()
        }
    }, [selectedDate])

    const handleCloseModal = () => {
        setIsClosing(true)
        setTimeout(() => {
            setShowModal(false)
            setIsClosing(false)
        }, 500)
    }

    const handleChooseDate = (day) => {
        setSelectedDate(day)
        handleCloseModal()
    }

    return (
        <div>
            <div className="flex flex-col">
                <p className="text-primary-100 font-semibold flex gap-3 items-center cursor-pointer border-b border-primary-100 w-fit"
                    onClick={() => { setShowModal(true) }}
                >
                    <span>{capitalizeFirstLetter(selectedDate.title)}</span>
                    <span><FaChevronDown /></span>
                </p>
                <div className="flex gap-2 mt-7">
                    <span><RiCalendarScheduleLine size={'1.5rem'} /></span>
                    <span className="font-semibold text-gray-700">LỊCH KHÁM</span>
                </div>
                <div></div>
                <div className="mt-4 grid grid-cols-5 gap-3">
                    {timeFrames && timeFrames?.length > 0 && timeFrames.map(item => {
                        return (
                            <div key={item?.id} className="bg-gray-200 text-center py-2 font-semibold cursor-pointer border-2 border-gray-200 hover:border-primary-100 duration-300">{item?.time_frame}</div>
                        )
                    })}
                </div>
                {(!timeFrames || timeFrames?.length === 0) &&
                    <div className="font-semibold">{capitalizeFirstLetter(selectedDate.title)} bác sĩ chưa có lịch !</div>
                }
            </div>
            {/* làm modal chọn ngày */}
            {showModal &&
                <div className={`fixed bg-black/55 top-0 left-0 bottom-0 right-0 ${isClosing ? "animate-fade-out" : "animate-fade-in"}`}
                    onClick={(e) => {
                        if (e.target == e.currentTarget) {
                            handleCloseModal()
                        }
                    }}
                >
                    <div className={`bg-white px-5 absolute bottom-0 w-full ${isClosing ? "animate-slide-down" : "animate-slide-top"}`}>
                        {days.length > 0 && days.map(day => {
                            return (
                                <div className="py-3 text-lg cursor-pointer" key={day.value}
                                    onClick={() => { handleChooseDate(day) }}>
                                    {capitalizeFirstLetter(day.title)}
                                </div>
                            )
                        })}
                        <div className="py-3 text-lg cursor-pointer" onClick={() => { handleCloseModal() }}>
                            Bỏ qua
                        </div>
                    </div>
                </div>
            }
        </div>

    );
}

export default Schedules;