import { GoHome } from "react-icons/go";
import { useLocation, useNavigate } from "react-router-dom";
import { DOCTORS, HOMEPAGE, SPECIALTY } from "../utils/path";
import { useState } from "react";
import { useEffect } from "react";
import { getSpecialtyById } from "../services/specialtyService";
import { getDoctorFollowSpecialty } from "../services/doctorService";
import defaultAvatar from '../assets/defaultAvatar.png'
import Schedules from "./Schedules";
import { GiPositionMarker } from "react-icons/gi";

function DetailSpecialty() {

    const naviagte = useNavigate()
    const [specialty, setSpeciallty] = useState(null)
    const [doctors, setDoctors] = useState([])

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const id = searchParams.get('id');

    useEffect(() => {
        const fetchSpecialty = async () => {
            const res = await getSpecialtyById(id)
            // console.log(res);
            if (res.err === 0) {
                setSpeciallty(res.data)
            }
        }

        const fetchDoctor = async () => {
            const res = await getDoctorFollowSpecialty(id)
            if (res.err === 0) {
                setDoctors(res.data)
            }
        }

        const fetchData = async () => {
            await Promise.all([fetchSpecialty(), fetchDoctor()])
        }

        fetchData()

    }, [])

    useEffect(()=>{
        
    },[])

    console.log(doctors);


    return (
        <>
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
                        <span className="text-black">{specialty?.name}</span>
                    </div>
                </div>
                <div className="mt-10">
                    <div className="prose">
                        {specialty && <div dangerouslySetInnerHTML={{ __html: specialty?.description_detail?.description }} />}
                    </div>
                </div>
            </div>
            <div className="bg-[#EEEEEE] lg:px-40 md:px-20 px-5 py-5">
                {doctors && doctors.length > 0 &&
                    doctors.map(doctor => {
                        return (
                            <div key={doctor.id} className="bg-white rounded-xl shadow-item flex gap-4 px-3 py-7 mt-5">
                                <div className="w-1/2 flex gap-7">
                                    <div className="cursor-pointer" onClick={() => { naviagte(`${DOCTORS}/chi-tiet/${doctor.id}`) }}>
                                        <div className="rounded-full size-20 overflow-hidden">
                                            <img className="object-center object-cover size-full" src={(doctor?.user?.avatar) ? doctor?.user?.avatar : defaultAvatar} />
                                        </div>
                                        <p className="text-primary-50 text-sm">Xem thêm</p>
                                    </div>
                                    <div>
                                        <div className="flex">
                                            <div className="flex items-center gap-2 text-primary-50 text-lg font-semibold cursor-pointer"
                                                onClick={() => { naviagte(`${DOCTORS}/chi-tiet/${doctor.id}`) }}
                                            >
                                                {doctor?.position.map((item, index) => {
                                                    return (
                                                        <p key={`pos-${item.id}`} className="">{item.name}{""}{index === doctor?.position?.length - 1 ? '' : ','}</p>
                                                    )
                                                })}
                                                <p className="">{doctor?.user?.firstName} {doctor?.user?.lastName}</p>
                                            </div>
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
                                <div className="w-1/2 flex flex-col gap-3">
                                    <div className="">
                                        <Schedules idDoctor={doctor.id} />
                                    </div>
                                    <div className="flex gap-2 mt-3 items-center">
                                        <h4 className="text-xl">Giá khám :</h4>
                                        <p className="text-primary-100 underline">{doctor?.price?.toLocaleString('vi-VN')}Đ</p>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </>

    );
}

export default DetailSpecialty;