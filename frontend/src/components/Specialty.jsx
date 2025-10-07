import { GoHome } from "react-icons/go";
import { useNavigate } from "react-router-dom";
import { HOMEPAGE, SPECIALTY } from "../utils/path";
import { useEffect, useState } from "react";
import { getSpecialties } from "../services/specialtyService";

function Specialty() {

    const navigate = useNavigate()
    const [specialties, setSpecialties] = useState([])

    useEffect(() => {
        const fetchSpecialties = async () => {
            const res = await getSpecialties()
            if (res.err === 0) {
                setSpecialties(res.data)
            }
        }
        fetchSpecialties()
    }, [])

    return (
        <div className="lg:px-40 md:px-20 px-5 py-5">
            <div className="flex items-center">
                <span className="cursor-pointer"
                    onClick={() => { navigate(HOMEPAGE) }}
                >
                    <GoHome color="#00A2A1" size={'1.25rem'} />
                </span>
                <span>/</span>
                <span className="ml-2">Khám chuyên khoa</span>
            </div>
            <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-[30px] mt-5">
                {specialties.length > 0 &&
                    specialties.map((item) => {
                        return (
                            <div key={item.id} className="lg:w-64 w-auto cursor-pointer" onClick={()=>{navigate(`${SPECIALTY}/${item?.slug}?id=${item.id}`)}}>
                                <div className="w-full h-36">
                                    <img className="object-center object-cover size-full" src={item?.images} />
                                </div>
                                <p className="text-center font-semibold">{item.name}</p>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    );
}

export default Specialty;