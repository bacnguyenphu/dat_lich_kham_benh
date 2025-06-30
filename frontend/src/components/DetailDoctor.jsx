import { GoHome } from "react-icons/go";
import { useNavigate, useParams } from "react-router-dom";
import { SPECIALTY } from "../utils/path";
import { useEffect, useState } from "react";
import { getDoctorById } from "../services/doctorService";
import { GiPositionMarker } from "react-icons/gi";
import { FaChevronDown } from "react-icons/fa";
import { RiCalendarScheduleLine } from "react-icons/ri";
import defaultAvatar from '../assets/defaultAvatar.png'
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import { capitalizeFirstLetter } from "../utils/capitalizeFirstLetter";
import { getScheduleFollowDate } from "../services/scheduleService";
dayjs.locale('vi')


function DetailDoctor() {

    const days = []

    for (let i = 0; i < 7; i++) {
        const date = {
            title: dayjs().add(i, 'day').format('dddd - DD/MM'),
            value: dayjs().add(i, 'day').format('YYYY-MM-DD'),
        }
        days.push(date)
    }

    const [selectedDate, setSelectedDate] = useState(days[0])
    const [doctor, setDoctor] = useState(null)
    const [timeFrames, setTimeFrames] = useState([])
    const [showModal, setShowModal] = useState(false)
    const [isClosing, setIsClosing] = useState(false)

    const naviagte = useNavigate()
    const { idDoctor } = useParams();

    useEffect(() => {
        const fetchDoctor = async () => {
            const res = await getDoctorById(idDoctor)
            if (res.err === 0) {
                setDoctor(res.data)
            }
        }
        fetchDoctor()
    }, [idDoctor])

    useEffect(() => {
        if (doctor !== null) {
            const fetchSchedule = async () => {
                const res = await getScheduleFollowDate(idDoctor, selectedDate.value)
                if (res.err === 0) {
                    setTimeFrames(res?.data?.time_frame)
                }
            }
            fetchSchedule()
        }
    }, [doctor, selectedDate])

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

    console.log(doctor);


    return (
        <div className="lg:px-40 md:px-20 px-5 py-5">
            <div className="flex items-center">
                <span className="cursor-pointer"
                    onClick={() => { naviagte(HOMEPAGE) }}
                >
                    <GoHome color="#00A2A1" size={'1.25rem'} />
                </span>
                <div className="flex items-center gap-2 text-primary-100">
                    <span className="">/</span>
                    <span className="cursor-pointer" onClick={() => { naviagte(SPECIALTY) }}>Khám chuyên khoa</span>
                    <span className="">/</span>
                    <span className="cursor-pointer" onClick={() => { naviagte(SPECIALTY) }}>Khám chuyên khoa</span>
                    <span className="">/</span>
                    <span className="cursor-pointer">{doctor?.specialty[0].name}</span>
                    <span className="">/</span>
                    <div className="flex items-center gap-2 text-black">
                        {doctor?.position.map(item => {
                            return (
                                <p key={`pos-${item.id}`} className="">{item.name}{""}</p>
                            )
                        })}
                        <p className="font-semibold">{doctor?.user?.firstName} {doctor?.user?.lastName}</p>
                    </div>
                </div>
            </div>
            <div className="mt-8 flex gap-5">
                <div className="rounded-full size-32 overflow-hidden">
                    <img className="object-center object-cover size-full" src={(doctor?.user?.avatar) ? doctor?.user?.avatar : defaultAvatar} />
                </div>
                <div>
                    <div className="flex items-center gap-2 text-black text-xl">
                        {doctor?.position.map(item => {
                            return (
                                <p key={`pos-${item.id}`} className="">{item.name}{""}</p>
                            )
                        })}
                        <p className="font-semibold">{doctor?.user?.firstName} {doctor?.user?.lastName}</p>
                    </div>
                    <p className="whitespace-pre-line mt-3 text-gray-700">
                        {doctor?.description}
                    </p>
                    <div className="mt-2 flex gap-1 items-center text-gray-700">
                        <span><GiPositionMarker /></span>
                        <span>{doctor?.user?.address}</span>
                    </div>
                </div>
            </div>

            <div className="flex gap-5 mt-8 ">
                <div className="w-1/2 flex flex-col">
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
                <div className="w-1/2 pl-5">
                    <div className="border-b border-gray-400 pb-4 w-fit">
                        <h4 className="text-xl font-semibold">Địa chỉ khám</h4>
                        <p className="font-semibold text-sm text-primary-100">Nger Hospital</p>
                        <p className="text-sm">Thôn Tây Xuân Vy, Hoằng Thanh, Hoằng Hóa, Thanh Hóa</p>
                    </div>
                    <div className="flex gap-2 mt-3 items-center">
                        <h4 className="text-xl">Giá khám :</h4>
                        <p className="text-primary-100 underline">{doctor?.price?.toLocaleString('vi-VN')}Đ</p>
                    </div>
                </div>
            </div>
            <hr className="my-10 h-[1px] bg-gray-400" />
            <div className="prose">
                {doctor && <div dangerouslySetInnerHTML={{ __html: doctor?.description_detail?.description }} />}
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

export default DetailDoctor;