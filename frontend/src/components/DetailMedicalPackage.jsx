import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getMedicalPackageById } from "../services/medicalPackageService";
import { GoHome } from "react-icons/go";
import { HOMEPAGE, MEDICAL_PACKAGE } from "../utils/path";
import defaultAvatar from '../assets/default_image.webp'
import Schedules from "./Schedules";

function DetailMedicalPackage() {
    const [medicalPackage, setMedicalPackage] = useState(null)

    const naviagte = useNavigate()
    const { id } = useParams();

    useEffect(() => {
        const fetchMedicalPackage = async () => {
            const res = await getMedicalPackageById(id)
            if (res.err === 0) {
                setMedicalPackage(res.data)
            }
        }
        fetchMedicalPackage()
    }, [id])

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
                    <span className="cursor-pointer" onClick={() => { naviagte(MEDICAL_PACKAGE) }}>Danh mục khám tổng quát</span>
                    <span className="">/</span>
                    <span className="cursor-pointer" onClick={() => { naviagte(`${MEDICAL_PACKAGE}/${medicalPackage?.category_package?.slug}?id=${medicalPackage?.category_package?.id}`) }}>{medicalPackage?.category_package?.name}</span>
                    <span className="">/</span>
                    <span className="text-black">{medicalPackage?.name}</span>
                </div>
            </div>
            <div className="mt-8 flex gap-5">
                <div className="rounded-full size-32 overflow-hidden w-1/6">
                    <img className="object-center object-cover size-full" src={(medicalPackage?.image) ? medicalPackage?.image : defaultAvatar} />
                </div>
                <div className="w-5/6">
                    <div className="flex items-center gap-2 text-black text-xl font-semibold">
                        {medicalPackage?.name}
                    </div>
                    <p className="whitespace-pre-line mt-3 text-gray-700">
                        {medicalPackage?.description}
                    </p>
                   
                </div>
            </div>

            <div className="flex gap-5 mt-8 ">
                <div className="w-1/2">
                    <Schedules idMedicalPackage={medicalPackage?.id} />
                </div>
                <div className="w-1/2 pl-5">
                    <div className="border-b border-gray-400 pb-4 w-fit">
                        <h4 className="text-xl font-semibold">Địa chỉ khám</h4>
                        <p className="font-semibold text-sm text-primary-100">Nger Hospital</p>
                        <p className="text-sm">Thôn Tây Xuân Vy, Hoằng Thanh, Hoằng Hóa, Thanh Hóa</p>
                    </div>
                    <div className="flex gap-2 mt-3 items-center">
                        <h4 className="text-xl">Giá khám :</h4>
                        <p className="text-primary-100 underline">{medicalPackage?.price?.toLocaleString('vi-VN')}Đ</p>
                    </div>
                </div>
            </div>
            <hr className="my-10 h-[1px] bg-gray-400" />
            <div className="prose">
                {medicalPackage && <div dangerouslySetInnerHTML={{ __html: medicalPackage?.description_detail?.description }} />}
            </div>

        </div>
    );
}

export default DetailMedicalPackage;