import { useNavigate } from "react-router-dom";
import family from "../assets/familyImage.png";
import { navs } from "../utils/navs";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useEffect, useState } from "react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaEye,
  FaHandHoldingMedical,
  FaUserDoctor,
} from "react-icons/fa6";
import { BiSolidNavigation } from "react-icons/bi";
import { MEDICAL_PACKAGE, SPECIALTY } from "../utils/path";
import { getCategoryPackage } from "../services/categoryPackageService";
import { getSpecialties } from "../services/specialtyService";
import { scrollToTop } from "../utils/scrollToTop";

// Nút Arrow tùy chỉnh cho Slider
function SampleNextArrow(props) {
  const { onClick } = props;
  return (
    <div
      onClick={onClick}
      className="hidden md:flex absolute top-1/2 -right-4 -translate-y-1/2 z-10 cursor-pointer h-10 w-10 items-center justify-center rounded-full bg-white shadow-md border border-slate-100 hover:bg-blue-50 transition-colors"
    >
      <FaChevronRight size={"1.2em"} className="text-blue-600" />
    </div>
  );
}

function SamplePrevArrow(props) {
  const { onClick } = props;
  return (
    <div
      onClick={onClick}
      className="hidden md:flex absolute top-1/2 -left-4 -translate-y-1/2 z-10 cursor-pointer h-10 w-10 items-center justify-center rounded-full bg-white shadow-md border border-slate-100 hover:bg-blue-50 transition-colors"
    >
      <FaChevronLeft size={"1.2em"} className="text-blue-600" />
    </div>
  );
}

function HomePage() {
  const navigate = useNavigate();
  const [specialties, setSpecialties] = useState([]);
  const [categoryPackage, setCategoryPackage] = useState([]);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4, // Hiển thị 4 thẻ trên PC cho đẹp
    slidesToScroll: 1,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1.2, arrows: false } }, // 1.2 để người dùng mobile biết có thể vuốt
    ],
  };

  useEffect(() => {
    const fetchSpecialties = async () => {
      const res = await getSpecialties();
      if (res.err === 0) setSpecialties(res?.data);
    };

    const fetchCategoryPackage = async () => {
      const res = await getCategoryPackage(6);
      if (res.err === 0) setCategoryPackage(res.data);
    };

    const fetchData = async () => {
      await Promise.all([fetchCategoryPackage(), fetchSpecialties()]);
    };

    fetchData();
    scrollToTop();
  }, []);

  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      {/* Hero Banner */}
      <div className="relative w-full xl:h-[500px] lg:h-[400px] md:h-[350px] h-[250px] bg-slate-200 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10"></div>
        <img
          className="object-cover object-center w-full h-full"
          src={family}
          alt="Family Banner"
        />
      </div>

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        {/* Dành cho bạn Section */}
        <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8 mb-12 border border-slate-100">
          <p className="text-2xl font-bold text-slate-800 mb-8 font-sans">
            Dành cho bạn
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-10">
            {navs.map((nav, index) => (
              <div
                key={`nav-${index}-hp`}
                className="cursor-pointer group flex flex-col items-center"
                onClick={() => navigate(nav.path)}
              >
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-white shadow-md group-hover:shadow-xl group-hover:scale-105 transition-all duration-300 bg-blue-50">
                  <img
                    className="object-cover object-center w-full h-full"
                    src={nav.image}
                    alt={nav.name}
                  />
                </div>
                <p className="text-base sm:text-lg font-semibold text-slate-700 mt-4 text-center group-hover:text-blue-600 transition-colors">
                  {nav.name}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Chuyên khoa Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-800">Chuyên khoa</h2>
            <button
              className="text-sm font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-full transition-colors"
              onClick={() => navigate(SPECIALTY)}
            >
              Xem thêm
            </button>
          </div>
          <div className="slider-container -mx-2">
            <Slider {...settings}>
              {specialties.length > 0 &&
                specialties.map((item) => (
                  <div
                    key={item.id}
                    className="px-2 pb-4 pt-2"
                    onClick={() =>
                      navigate(`${SPECIALTY}/${item?.slug}?id=${item.id}`)
                    }
                  >
                    <div className="bg-white cursor-pointer border border-slate-100 p-4 rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
                      <div className="h-40 rounded-xl bg-slate-50 flex items-center justify-center overflow-hidden p-2">
                        <img
                          className="object-contain w-full h-full mix-blend-multiply"
                          src={item?.images}
                          alt={item.name}
                        />
                      </div>
                      <p className="text-center font-semibold text-slate-700 mt-4 line-clamp-2">
                        {item.name}
                      </p>
                    </div>
                  </div>
                ))}
            </Slider>
          </div>
        </div>

        {/* Danh mục khám bệnh Section */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-800">
              Gói khám nổi bật
            </h2>
            <button
              className="text-sm font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-full transition-colors"
              onClick={() => navigate(MEDICAL_PACKAGE)}
            >
              Xem thêm
            </button>
          </div>
          <div className="slider-container -mx-2">
            <Slider {...settings}>
              {categoryPackage.length > 0 &&
                categoryPackage.map((item) => (
                  <div
                    key={item.id}
                    className="px-2 pb-4 pt-2"
                    onClick={() =>
                      navigate(`${MEDICAL_PACKAGE}/${item?.slug}?id=${item.id}`)
                    }
                  >
                    <div className="bg-white cursor-pointer border border-slate-100 p-4 rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
                      <div className="h-40 rounded-xl bg-slate-50 flex items-center justify-center overflow-hidden p-2">
                        <img
                          className="object-contain w-full h-full mix-blend-multiply"
                          src={item?.image}
                          alt={item.name}
                        />
                      </div>
                      <p className="text-center font-semibold text-slate-700 mt-4 line-clamp-2">
                        {item.name}
                      </p>
                    </div>
                  </div>
                ))}
            </Slider>
          </div>
        </div>

        {/* Thống kê Section */}
        <div className="bg-gradient-to-br from-blue-600 to-cyan-500 rounded-3xl p-8 sm:p-12 text-white shadow-xl">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-10">
            Tin tưởng bởi hàng triệu khách hàng
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x-0 md:divide-x divide-white/20">
            <div className="flex flex-col items-center text-center">
              <div className="bg-white/20 p-4 rounded-full mb-4 backdrop-blur-sm">
                <FaHandHoldingMedical size={"2.5rem"} className="text-white" />
              </div>
              <h3 className="font-bold text-3xl mb-1">3.0M+</h3>
              <p className="text-blue-100 font-medium">Lượt khám</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="bg-white/20 p-4 rounded-full mb-4 backdrop-blur-sm">
                <FaUserDoctor size={"2.5rem"} className="text-white" />
              </div>
              <h3 className="font-bold text-3xl mb-1">200+</h3>
              <p className="text-blue-100 font-medium">Bác sĩ giỏi</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="bg-white/20 p-4 rounded-full mb-4 backdrop-blur-sm">
                <BiSolidNavigation size={"2.5rem"} className="text-white" />
              </div>
              <h3 className="font-bold text-3xl mb-1">300K+</h3>
              <p className="text-blue-100 font-medium">Truy cập / tháng</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="bg-white/20 p-4 rounded-full mb-4 backdrop-blur-sm">
                <FaEye size={"2.5rem"} className="text-white" />
              </div>
              <h3 className="font-bold text-3xl mb-1">10K+</h3>
              <p className="text-blue-100 font-medium">Truy cập / ngày</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
