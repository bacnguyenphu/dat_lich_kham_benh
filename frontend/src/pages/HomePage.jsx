import { useNavigate } from 'react-router-dom';
import family from '../assets/familyImage.jpeg'
import { navs } from '../utils/navs';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useEffect, useState } from 'react';
import { FaChevronLeft, FaChevronRight, FaEye, FaHandHoldingMedical, FaUserDoctor  } from "react-icons/fa6";
import { BiSolidNavigation } from "react-icons/bi";
import { MEDICAL_PACKAGE, SPECIALTY } from '../utils/path';
import { getCategoryPackage } from '../services/categoryPackageService';
import { getSpecialties } from '../services/specialtyService';

function HomePage() {

    const navigate = useNavigate()
    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 2,
        nextArrow: <SampleNextArrow />,
        prevArrow: <SamplePrevArrow />,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: false
                }
            },
            {
                breakpoint: 769,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    initialSlide: 2
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1
                }
            }
        ]
    };

    const CustomSlide = (props) => {
        const { key, image, name } = props;
        return (
            <div key={key} className=" mx-2.5 cursor-pointer border-2 border-gray-400 p-5 rounded-xl ">
                <div className='h-36 rounded-xl w-full'>
                    <img className="object-center object-contain size-full" src={image} />
                </div>
                <p className="text-center font-semibold pt-5 truncate">{name}</p>
            </div>
        );
    }

    function SampleNextArrow(props) {
        const { onClick } = props;
        return (
            <div onClick={onClick} className='hidden lg:block absolute top-[45%] left-[98%] z-20 cursor-pointer p-2 rounded-full bg-white border border-[#34929E]'>
                <FaChevronRight size={"1.5em"} color={"#34929E"} />
            </div>
        );
    }

    function SamplePrevArrow(props) {
        const { onClick } = props;
        return (
            <div onClick={onClick} className='hidden lg:block absolute top-[45%] translate-x-[-10%] z-20 cursor-pointer p-2 rounded-full bg-white border border-[#34929E]'>
                <FaChevronLeft size={"1.5em"} color={"#34929E"} />
            </div>
        );
    }

    const [specialties, setSpecialties] = useState([])
    const [categoryPackage, setCategoryPackage] = useState([])

    useEffect(() => {
        const fetchSpecialties = async () => {
            const res = await getSpecialties()
            if (res.err===0) {
                setSpecialties(res?.data)
            }
        }

        const fetchCategoryPackage = async () => {
            const res = await getCategoryPackage(6)
            if (res.err === 0) {
                setCategoryPackage(res.data)
            }
        }

        const fetchData = async () => {
            await Promise.all([fetchCategoryPackage(), fetchSpecialties()])
        }
        fetchData()
    }, [])

    return (
        <div>
            <div className="xl:h-[465px] lg:h-[400px] md:h-[365px] h-[265px]">
                <img className="object-center object-cover size-full" src={family} />
            </div>
            <div className='lg:px-40 md:px-20 px-5 pb-10'>
                <div className=' mt-10'>
                    <p className='text-2xl font-semibold'>Dành cho bạn</p>
                    <div className='flex flex-wrap gap-20 mt-10 justify-center lg:justify-start'>
                        {navs.map((nav, index) => {
                            return (
                                <div key={`nav-${index}-hp`} className='cursor-pointer'
                                    onClick={() => { navigate(nav.path) }}
                                >
                                    <div className='lg:size-56 md:size-44 size-56 rounded-full overflow-hidden'>
                                        <img className='object-cover object-center size-full' src={nav.image} />
                                    </div>
                                    <p className='text-xl text-center mt-4'>{nav.name}</p>
                                </div>
                            )
                        })}
                    </div>
                </div>

                <div>
                    <div className='mt-12 flex justify-between'>
                        <p className='text-2xl font-semibold'>Chuyên khoa</p>
                        <button className='rounded-lg px-2 py-1 text-primary-100 border border-primary-100 cursor-pointer'
                            onClick={() => { navigate(SPECIALTY) }}
                        >Xem thêm</button>
                    </div>
                    <div className="slider-container mt-10">
                        <Slider {...settings}>
                            {specialties.length > 0 &&
                                specialties.map((item) => {
                                    return (
                                        <CustomSlide key={item.id} image={item?.images} name={item.name} />
                                    )
                                })
                            }

                        </Slider>
                    </div>
                </div>

                <div className='mt-12 '>
                    <div className='flex justify-between'>
                        <p className='text-2xl font-semibold'>Danh mục khám bệnh</p>
                        <button className='rounded-lg px-2 py-1 text-primary-100 border border-primary-100 cursor-pointer'
                            onClick={() => { navigate(MEDICAL_PACKAGE) }}
                        >Xem thêm</button>
                    </div>
                    <div className="slider-container mt-10">
                        <Slider {...settings}>
                            {categoryPackage.length > 0 &&
                                categoryPackage.map((item) => {
                                    return (
                                        <CustomSlide key={item.id} image={item?.image} name={item.name} />
                                    )
                                })
                            }
                        </Slider>
                    </div>
                </div>

                <div className='mt-12'>
                    <h2 className='text-2xl font-semibold text-center'>Thống kê</h2>
                    <div className='flex gap-20 items-center justify-center mt-10'>
                        <div className='flex flex-col items-center w-1/8'>
                            <div>
                                <FaHandHoldingMedical size={"3rem"} color='#4ABCE2' />
                            </div>
                            <h3 className='font-bold text-2xl mt-4'>3.0M+</h3>
                            <p className='text-xl text-gray-500'>Lượt khám</p>
                        </div>
                        <div className='flex flex-col items-center w-1/8'>
                            <div>
                                <FaUserDoctor size={"3rem"} color='#4ABCE2' />
                            </div>
                            <h3 className='font-bold text-2xl mt-4'>200+</h3>
                            <p className='text-xl text-gray-500'>Bác sĩ</p>
                        </div>
                        <div className='flex flex-col items-center w-1/8'>
                            <div>
                                <BiSolidNavigation size={"3rem"} color='#4ABCE2' />
                            </div>
                            <h3 className='font-bold text-2xl mt-4'>300K+</h3>
                            <p className='text-xl text-gray-500 break-words text-center'>Lượt truy cập hàng tháng</p>
                        </div>
                        <div className='flex flex-col items-center w-1/8'>
                            <div>
                                <FaEye size={"3rem"} color='#4ABCE2' />
                            </div>
                            <h3 className='font-bold text-2xl mt-4'>10.1K+</h3>
                            <p className='text-xl text-gray-500 break-words text-center'>Lượt truy cập hàng ngày</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
}

export default HomePage;