import { useNavigate } from 'react-router-dom';
import family from '../assets/familyImage.jpeg'
import { navs } from '../utils/navs';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useEffect, useState } from 'react';
import { getSpecialties } from '../services/specialtyService';
import { FaChevronLeft } from "react-icons/fa6";
import { FaChevronRight } from "react-icons/fa6";
import { SPECIALTY } from '../utils/path';

function HomePage() {

    const navigate = useNavigate()
    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        nextArrow: <SampleNextArrow />,
        prevArrow: <SamplePrevArrow />
    };

    const CustomSlide = (props) => {
        const { key, image, name } = props;
        return (
            <div key={key} className="xl:w-[370px] xl:h-[300px] cursor-pointer border-2 border-gray-400 p-5 rounded-xl mx-5">
                <div className='h-52 rounded-xl'>
                    <img className="object-center object-cover size-full" src={image} />
                </div>
                <p className="text-center font-semibold pt-5">{name}</p>
            </div>
        );
    }

    function SampleNextArrow(props) {
        const { onClick } = props;
        return (
            <div onClick={onClick} className='hidden lg:block absolute top-[45%] left-[98%] z-20 cursor-pointer border p-2 rounded-full bg-white border border-[#34929E]'>
                <FaChevronRight size={"1.5em"} color={"#34929E"} />
            </div>
        );
    }

    function SamplePrevArrow(props) {
        const { onClick } = props;
        return (
            <div onClick={onClick} className='hidden lg:block absolute top-[45%] translate-x-[-10%] z-20 cursor-pointer border p-2 rounded-full bg-white border border-[#34929E]'>
                <FaChevronLeft size={"1.5em"} color={"#34929E"} />
            </div>
        );
    }

    const [specialties, setSpecialties] = useState([])

    useEffect(() => {
        const fetchSpecialties = async () => {
            const res = await getSpecialties(8)
            if (res.err === 0) {
                setSpecialties(res.data)
            }
        }
        fetchSpecialties()
    }, [])

    return (
        <div>
            <div className="xl:h-[465px] lg:h-[400px] md:h-[365px] h-[265px]">
                <img className="object-center object-cover size-full" src={family} />
            </div>
            <div className='lg:px-40 md:px-20 px-5'>
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
                                specialties.map((item, i) => {
                                    return (
                                        <CustomSlide key={item.id} image={item?.images} name={item.name} />
                                    )
                                })
                            }

                        </Slider>
                    </div>
                </div>
            </div>
        </div>

    );
}

export default HomePage;