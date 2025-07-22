import { useLocation } from 'react-router-dom';
import cate_banner from '../assets/ic_banner.b9608702.png'
import { useEffect, useState } from 'react';
import { getCategoryPackageById } from '../services/categoryPackageService';
import defaultAvatar from '../assets/default_image.webp'
import { GiPositionMarker } from 'react-icons/gi';
import Schedules from './Schedules';

function ListMedicalPackgeFollowCategory() {

    const [data, setData] = useState({
        id:'',
        name: '',
        imageCategoryMedicalPackage: null,
        description: '',
        medicalPackages: [],
        price:0
    })

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const id = searchParams.get('id');

    useEffect(() => {
        const fetchData = async () => {
            const res = await getCategoryPackageById(id)
            if (res.err === 0) {
                setData({
                    ...data,
                    id: res?.data?.id,
                    imageCategoryMedicalPackage: res?.data?.image,
                    name: res?.data?.name,
                    description: res?.data?.description,
                    medicalPackages: res?.data?.medical_package
                })
            }
        }
        fetchData()
    }, [id])

    console.log(data);


    return (
        <div>
            <div className="w-full h-72 bg-center bg-no-repeat bg-cover flex"
                style={{ backgroundImage: `url(${cate_banner})` }}
            >
                <div className='w-1/4 flex items-center justify-center'>
                    <div className='size-44'>
                        {data?.imageCategoryMedicalPackage &&
                            <img src={data.imageCategoryMedicalPackage} className='size-ful object-center object-cover' />
                        }
                    </div>
                </div>
                <div className='w-3/4 px-36'>
                    <h3 className='text-white font-bold text-3xl py-8'>{data.name}</h3>
                    <p className='font-semibold text-[#424242]'>{data.description}</p>
                </div>
            </div>
            <div className="lg:px-40 md:px-20 px-5 py-5">
                {data.medicalPackages && data.medicalPackages.length > 0 &&
                    data.medicalPackages.map(item => {
                        return (
                            <div key={item.id} className="bg-white rounded-xl shadow-item flex gap-10 px-3 py-7 mt-5">
                                <div className="w-1/2 flex gap-7">
                                    <div className="cursor-pointer" onClick={() => { naviagte(``) }}>
                                        <div className="rounded-full size-20 overflow-hidden">
                                            <img className="object-center object-cover size-full" src={(item?.image) ? item?.image : defaultAvatar} />
                                        </div>
                                        <p className="text-primary-50 text-sm">Xem thêm</p>
                                    </div>
                                    <div>
                                        <div className="flex">
                                            <div className="flex items-center gap-2 text-primary-50 text-lg font-semibold cursor-pointer"
                                                onClick={() => { naviagte(``) }}
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
                                        <Schedules  />
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
            </div>
        </div>
    );
}

export default ListMedicalPackgeFollowCategory;