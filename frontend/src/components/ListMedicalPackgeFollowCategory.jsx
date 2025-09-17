import { useLocation, useNavigate } from 'react-router-dom';
import cate_banner from '../assets/ic_banner.b9608702.png'
import { useEffect, useState } from 'react';
import { getCategoryPackageById } from '../services/categoryPackageService';
import defaultAvatar from '../assets/default_image.webp'
import { GiPositionMarker } from 'react-icons/gi';
import Schedules from './Schedules';
import Pagination from './Pagination';
import { getMedicalPackageFollowCategory } from '../services/medicalPackageService';
import { MEDICAL_PACKAGE } from '../utils/path';

function ListMedicalPackgeFollowCategory() {

    const [categoryMedical, setCategoryMedical] = useState({
        id: '',
        name: '',
        imageCategoryMedicalPackage: null,
        description: '',
        price: 0
    })

    const [medicalPackages, setMedicalPackages] = useState([])

    const [totalPages, setTotalPages] = useState(0)
    const limit = 7
    const [page, setPage] = useState(1)

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const id = searchParams.get('id');

    const navigate = useNavigate()

    useEffect(() => {
        const fetchCategoryMedical = async () => {
            const res = await getCategoryPackageById(id)
            if (res.err === 0) {
                setCategoryMedical({
                    ...categoryMedical,
                    id: res?.data?.id,
                    imageCategoryMedicalPackage: res?.data?.image,
                    name: res?.data?.name,
                    description: res?.data?.description,
                    slug: res?.data?.slug,
                })
            }
        }

        fetchCategoryMedical()
    }, [id])

    useEffect(() => {
        const fetchMedicalPackageFollowCategory = async () => {
            const res = await getMedicalPackageFollowCategory({
                idCategory: id,
                limit,
                page
            })
            if (res.err === 0) {
                setMedicalPackages(res.data)
                setTotalPages(res?.totalPage)
            }
        }

        fetchMedicalPackageFollowCategory()
    }, [page])

    return (
        <div>
            <div className="w-full h-72 bg-center bg-no-repeat bg-cover flex"
                style={{ backgroundImage: `url(${cate_banner})` }}
            >
                <div className='w-1/4 flex items-center justify-center'>
                    <div className='size-44'>
                        {categoryMedical?.imageCategoryMedicalPackage &&
                            <img src={categoryMedical.imageCategoryMedicalPackage} className='size-ful object-center object-cover' />
                        }
                    </div>
                </div>
                <div className='w-3/4 px-36'>
                    <h3 className='text-white font-bold text-3xl py-8'>{categoryMedical.name}</h3>
                    <p className='font-semibold text-[#424242]'>{categoryMedical.description}</p>
                </div>
            </div>
            <div className="lg:px-40 md:px-20 px-5 py-5">
                {medicalPackages && medicalPackages.length > 0 &&
                    medicalPackages.map(item => {
                        return (
                            <div key={item.id} className="bg-white rounded-xl shadow-item flex gap-10 px-3 py-7 mt-5">
                                <div className="w-1/2 flex gap-7">
                                    <div className="cursor-pointer" onClick={() => { navigate(`${MEDICAL_PACKAGE}/${categoryMedical?.slug}/${item.id}`) }}>
                                        <div className="rounded-full size-20 overflow-hidden">
                                            <img className="object-center object-cover size-full" src={(item?.image) ? item?.image : defaultAvatar} />
                                        </div>
                                        <p className="text-primary-50 text-sm">Xem thêm</p>
                                    </div>
                                    <div>
                                        <div className="flex">
                                            <div className="flex items-center gap-2 text-primary-50 text-lg font-semibold cursor-pointer"
                                                onClick={() => { navigate(`${MEDICAL_PACKAGE}/${categoryMedical?.slug}/${item.id}`) }}
                                            >
                                                {item.name}
                                            </div>
                                        </div>
                                        <p className="whitespace-pre-line mt-3 text-gray-700">
                                            {item?.description}
                                        </p>
                                        <div className="mt-2 flex gap-1 items-center text-gray-700">
                                            <span><GiPositionMarker /></span>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-1/2 flex flex-col gap-3">
                                    <div className="">
                                        <Schedules idMedicalPackage={item.id} />
                                    </div>
                                    <div className="flex gap-2 mt-3 items-center">
                                        <h4 className="text-xl">Giá khám :</h4>
                                        <p className="text-primary-100 underline">{item?.price?.toLocaleString('vi-VN')}Đ</p>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
                {medicalPackages.length === 0 &&
                    <h3>Chưa có gói khám !</h3>
                }
                {medicalPackages.length !== 0 &&
                    <div className="">
                        <Pagination setPage={setPage} totalPages={totalPages} />
                    </div>
                }

            </div>
        </div >
    );
}

export default ListMedicalPackgeFollowCategory;