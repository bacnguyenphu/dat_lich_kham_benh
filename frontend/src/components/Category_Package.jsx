import { useEffect, useState } from "react";
import { GoHome } from "react-icons/go";
import { getCategoryPackage } from "../services/categoryPackageService";
import { useNavigate } from "react-router-dom";
import { MEDICAL_PACKAGE } from "../utils/path";

function Category_Package() {

    const [categoryPackage, setCategoryPackage] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        const fetchData = async () => {
            const res = await getCategoryPackage()
            setCategoryPackage(res.data)

        }
        fetchData()
    }, [])

    console.log(categoryPackage);
    

    return (
        <div className="lg:px-40 md:px-20 px-5 py-5">
            <div className="flex items-center">
                <span className="cursor-pointer"
                    onClick={() => { naviagte(HOMEPAGE) }}
                >
                    <GoHome color="#00A2A1" size={'1.25rem'} />
                </span>
                <span>/</span>
                <span className="ml-2">Danh mục khám tổng quát</span>
            </div>

            <div className="my-6">
                <h2 className="text-xl font-semibold">
                    Danh mục khám tổng quát
                </h2>
                <div className="border border-gray-300 w-full my-3"></div>
            </div>
            <div className="flex gap-7 flex-wrap">
                {categoryPackage.length > 0 &&
                    categoryPackage.map(item => {
                        return (
                            <div key={item.id} className="w-[170px] h-60  flex flex-col items-center gap-5 pt-5 shadow-item cursor-pointer"
                            onClick={()=>{navigate(`${MEDICAL_PACKAGE}/${item?.slug}?id=${item.id}`)}}
                            >
                                <div className="w-[135px] h-[135px] rounded-full overflow-hidden bg-[#DEECDD]">
                                    <img className="object-cover object-center size-full" src={item?.image} />
                                </div>
                                <h2 className="font-semibold text-lg">{item.name}</h2>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    );
}

export default Category_Package;