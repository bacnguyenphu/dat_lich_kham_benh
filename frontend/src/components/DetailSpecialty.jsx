import { GoHome } from "react-icons/go";
import { useLocation, useNavigate } from "react-router-dom";
import { HOMEPAGE, SPECIALTY } from "../utils/path";
import { useState } from "react";
import { useEffect } from "react";
import { getSpecialtyById } from "../services/specialtyService";

function DetailSpecialty() {

    const naviagte = useNavigate()
    const [specialty, setSpeciallty] = useState(null)
    const [doctors, setDoctors] = useState([])

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const id = searchParams.get('id');

    useEffect(() => {
        // const fetchPostions = async () => {
        //     const res = await getPostions()
        //     if (res.err === 0) {
        //         setPositions(res.data)
        //     }
        // }
        // const fetchSpecialties = async () => {
        //     const res = await getSpecialties()
        //     if (res.err === 0) {
        //         setSpecialties(res.data)
        //     }
        // }
        // const fetchData = async () => {
        //     await Promise.all([fetchPostions(), fetchSpecialties()])
        // }
        // fetchData()
        const fetchSpecialty = async () => {
            const res = await getSpecialtyById(id)
            console.log(res);
            if (res.err === 0) {
                setSpeciallty(res.data)
            }
        }

        
        fetchSpecialty()
    }, [])

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
                    <span className="text-black">{specialty?.name}</span>
                </div>
            </div>
            <div className="mt-10">
                <div className="prose">
                    {specialty && <div dangerouslySetInnerHTML={{ __html: specialty?.description_detail?.description }} />}
                </div>
            </div>
        </div>
    );
}

export default DetailSpecialty;