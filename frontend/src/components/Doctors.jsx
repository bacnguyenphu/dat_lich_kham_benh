import { useNavigate } from "react-router-dom";
import { DOCTORS, HOMEPAGE } from "../utils/path";
import { GoHome } from "react-icons/go";
import { useState } from "react";
import { useEffect } from "react";
import { getDoctors } from "../services/doctorService";
import defaultAvatar from '../assets/defaultAvatar.png'
import Pagination from "./Pagination";

function Doctors() {

    const naviagte = useNavigate();
    const [doctors, setDoctors] = useState([])
    const limit = 10
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(0)

    useEffect(() => {
        const fetchDoctors = async () => {
            const res = await getDoctors(limit, page)
            if (res.err === 0) {
                setDoctors(res.data)
                setTotalPages(res.totalPage)
            }
        }
        fetchDoctors()
    }, [page])

    return (
        <div className="lg:px-40 md:px-20 px-5 py-5">
            <div className="flex items-center">
                <span className="cursor-pointer"
                    onClick={() => {naviagte(HOMEPAGE) }}
                >
                    <GoHome color="#00A2A1" size={'1.25rem'} />
                </span>
                <span>/</span>
                <span className="ml-2">Bác sĩ dành cho bạn</span>
            </div>
            <p className="text-xl font-semibold mt-4">Bác sĩ dành cho bạn</p>
            <div>
                {doctors.length > 0 &&
                    doctors.map((doctor) => {
                        return (
                            <div key={`doctor-${doctor.id}`} className="flex items-center gap-5 border-b border-gray-400 py-5 cursor-pointer"
                            onClick={()=>{naviagte(`${DOCTORS}/chi-tiet/${doctor.id}`)}}
                            >
                                <div className="size-28">
                                    <img className="object-center object-cover size-full" src={(doctor?.user?.avatar) ? doctor?.user?.avatar : defaultAvatar} />
                                </div>
                                <div className="flex items-center gap-2">
                                    {doctor?.position.map(item => {
                                        return (
                                            <p key={`pos-${item.id}`} className="text-xl">{item.name}{""}</p>
                                        )
                                    })}
                                    <p className="text-xl font-semibold">{doctor?.user?.firstName} {doctor?.user?.lastName}</p>
                                </div>


                            </div>
                        )
                    })
                }
                <Pagination setPage={setPage} totalPages={totalPages} />
            </div>
        </div>
    );
}

export default Doctors;