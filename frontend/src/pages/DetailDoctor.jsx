import { GoHome } from "react-icons/go";
import { useNavigate, useParams } from "react-router-dom";
import { HOMEPAGE, SPECIALTY } from "../utils/path";
import { useEffect, useState } from "react";
import { getDoctorById } from "../services/doctorService";
import { GiPositionMarker } from "react-icons/gi";
import defaultAvatar from '../assets/defaultAvatar.png'
import Schedules from "../components/Schedules";
import { scrollToTop } from "../utils/scrollToTop";


function DetailDoctor() {

    const [doctor, setDoctor] = useState(null)

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
        scrollToTop()
    }, [idDoctor])

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
                    <span className="cursor-pointer" onClick={() => { naviagte(`${SPECIALTY}/${doctor?.specialty[0]?.slug}?id=${doctor?.specialty[0].id}`) }}>{doctor?.specialty[0].name}</span>
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
                <div className="w-1/2">
                    <Schedules idDoctor={idDoctor} />
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

        </div>
    );
}

export default DetailDoctor;