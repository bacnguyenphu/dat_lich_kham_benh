import { useEffect, useState } from "react";
import { GoHome } from "react-icons/go";
import { getCategoryPackage } from "../services/categoryPackageService";
import { useNavigate } from "react-router-dom";
import { HOMEPAGE, MEDICAL_PACKAGE } from "../utils/path";

function Category_Package() {
  const [categoryPackage, setCategoryPackage] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const res = await getCategoryPackage();
      if (res && res.data) {
        setCategoryPackage(res.data);
      }
    };
    fetchData();
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
          <span className="text-blue-600">Danh mục Khám tổng quát</span>
        </div>

        <div className="mb-10">
          <h1 className="text-3xl font-bold text-slate-800">
            Danh mục Khám tổng quát
          </h1>
          <p className="text-slate-500 mt-2">
            Chủ động bảo vệ sức khỏe với các gói khám tầm soát được thiết kế
            khoa học, phù hợp cho mọi lứa tuổi và nhu cầu.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
          {categoryPackage.length > 0 ? (
            categoryPackage.map((item) => {
              return (
                <div
                  key={item.id}
                  className="group bg-white rounded-2xl shadow-sm border border-slate-100 p-5 sm:p-6 flex flex-col items-center justify-center gap-4 cursor-pointer hover:shadow-xl hover:-translate-y-1.5 hover:border-blue-200 transition-all duration-300"
                  onClick={() =>
                    navigate(`${MEDICAL_PACKAGE}/${item?.slug}?id=${item.id}`)
                  }
                >
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden bg-blue-50/50 border-4 border-white shadow-sm group-hover:scale-110 group-hover:shadow-md transition-all duration-500 flex items-center justify-center p-2 relative">
                    <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors z-10"></div>
                    <img
                      className="object-contain object-center w-full h-full mix-blend-multiply"
                      src={item?.image}
                      alt={item.name}
                    />
                  </div>

                  <h2 className="font-bold text-[15px] sm:text-base text-center text-slate-700 group-hover:text-blue-600 transition-colors line-clamp-2 leading-tight">
                    {item.name}
                  </h2>
                </div>
              );
            })
          ) : (
            <div className="col-span-full py-12 text-center text-slate-500 bg-white rounded-2xl border border-slate-100">
              Đang tải danh mục gói khám...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Category_Package;
