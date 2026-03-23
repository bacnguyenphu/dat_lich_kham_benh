import { GoHome } from "react-icons/go";
import { useNavigate } from "react-router-dom";
import { HOMEPAGE, SPECIALTY } from "../utils/path";
import { useEffect, useState } from "react";
import { getSpecialties } from "../services/specialtyService";

function Specialty() {
  const navigate = useNavigate();
  const [specialties, setSpecialties] = useState([]);

  useEffect(() => {
    const fetchSpecialties = async () => {
      const res = await getSpecialties();
      if (res.err === 0) {
        setSpecialties(res.data);
      }
    };
    fetchSpecialties();
  }, []);

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 text-sm font-medium text-slate-500 mb-6">
          <div
            className="flex items-center gap-1.5 cursor-pointer hover:text-blue-600 transition-colors"
            onClick={() => navigate(HOMEPAGE)}
          >
            <GoHome size={"1.2rem"} className="pb-[2px]" />
            <span>Trang chủ</span>
          </div>
          <span className="text-slate-300">/</span>
          <span className="text-blue-600">Khám chuyên khoa</span>
        </div>

        <div className="mb-10">
          <h1 className="text-3xl font-bold text-slate-800">
            Danh sách Chuyên khoa
          </h1>
          <p className="text-slate-500 mt-2">
            Vui lòng chọn chuyên khoa phù hợp với tình trạng sức khỏe của bạn để
            được hỗ trợ tốt nhất.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 xl:gap-8">
          {specialties.length > 0 ? (
            specialties.map((item) => {
              return (
                <div
                  key={item.id}
                  className="group bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden cursor-pointer hover:shadow-xl hover:-translate-y-1.5 hover:border-blue-200 transition-all duration-300 flex flex-col"
                  onClick={() =>
                    navigate(`${SPECIALTY}/${item?.slug}?id=${item.id}`)
                  }
                >
                  <div className="w-full h-44 overflow-hidden bg-slate-100 relative">
                    <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors z-10"></div>
                    <img
                      className="object-cover object-center w-full h-full group-hover:scale-110 transition-transform duration-500 ease-out"
                      src={item?.images}
                      alt={item.name}
                    />
                  </div>

                  <div className="p-5 flex-1 flex items-center justify-center">
                    <p className="text-center font-bold text-lg text-slate-700 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {item.name}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full py-10 text-center text-slate-500">
              Đang tải danh sách chuyên khoa...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Specialty;
