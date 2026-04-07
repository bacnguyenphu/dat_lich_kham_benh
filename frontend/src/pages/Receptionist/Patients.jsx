import { useEffect, useState } from "react";
import { getPatients } from "../../services/patientService";
import { Pagination } from "../../components";
import dayjs from "dayjs";
import { HiOutlineMail, HiOutlinePhone } from "react-icons/hi";
import { IoLocationOutline } from "react-icons/io5";
import { BsGenderMale, BsGenderFemale } from "react-icons/bs";
import { IoIosSearch } from "react-icons/io";
import { FaRegEye } from "react-icons/fa6";

function Patients() {
  const limit = 10;
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [patients, setPatients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [value, setValue] = useState("");
  const [debouncedValue, setDebouncedValue] = useState("");

  // Gọi API lấy danh sách bệnh nhân
  useEffect(() => {
    const fetchPatients = async () => {
      setIsLoading(true);
      try {
        const res = await getPatients(limit, page, value);
        if (res && res.err === 0) {
          setPatients(res.data);
          setTotalPages(res.totalPage);
        }
      } catch (error) {
        console.error("Lỗi khi tải danh sách bệnh nhân:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatients();
  }, [page, debouncedValue]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, 500);
    return () => clearTimeout(handler);
  }, [value]);

  const renderGender = (gender) => {
    if (gender === "male") {
      return (
        <span className="flex items-center gap-1 text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md text-xs font-semibold w-fit">
          <BsGenderMale /> Nam
        </span>
      );
    }
    if (gender === "female") {
      return (
        <span className="flex items-center gap-1 text-pink-600 bg-pink-50 px-2 py-0.5 rounded-md text-xs font-semibold w-fit">
          <BsGenderFemale /> Nữ
        </span>
      );
    }
    return <span className="text-slate-400 text-xs">Chưa rõ</span>;
  };

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ===== Tiêu đề trang ===== */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Hồ sơ Bệnh nhân
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Tra cứu thông tin hành chính của bệnh nhân trên hệ thống
            </p>
          </div>
        </div>

        {/* ===== TÌM KIẾM (SEARCH) ===== */}
        <div className="relative w-full md:w-[350px] lg:w-[400px] shrink-0 mb-5">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <IoIosSearch className="text-slate-400" size="1.25rem" />
          </div>
          <input
            className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-[15px] text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
            placeholder="Tìm bệnh nhân hoặc SĐT..."
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
            }}
          />
        </div>

        {/* ===== Bảng Dữ liệu ===== */}
        <div className="bg-white border border-slate-200 shadow-sm rounded-2xl overflow-hidden flex flex-col w-full">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead className="bg-slate-50 text-slate-500 text-[13px] uppercase tracking-wider font-bold border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 w-16 text-center">STT</th>
                  <th className="px-6 py-4 w-[25%]">Họ và Tên</th>
                  <th className="px-6 py-4 w-[25%]">Liên hệ</th>
                  <th className="px-6 py-4">Ngày sinh & Giới tính</th>
                  <th className="px-6 py-4">Địa chỉ</th>
                  <th className="px-6 py-4 text-center w-28">Thao tác</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {isLoading ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-12 text-center text-slate-500"
                    >
                      Đang tải dữ liệu...
                    </td>
                  </tr>
                ) : patients.length > 0 ? (
                  patients.map((patient, index) => (
                    <tr
                      key={patient.id}
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      {/* STT */}
                      <td className="px-6 py-4 text-center">
                        <span className="text-sm font-semibold text-slate-500">
                          {(page - 1) * limit + index + 1}
                        </span>
                      </td>

                      {/* Họ và Tên */}
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <p className="font-bold text-[15px] text-slate-800">
                            {patient.fullName}
                          </p>
                          <p
                            className="text-[11px] font-mono text-slate-400 mt-0.5 truncate max-w-[150px]"
                            title={patient.id}
                          >
                            ID: {patient.id.substring(0, 8)}...
                          </p>
                        </div>
                      </td>

                      {/* Liên hệ (Gộp SĐT và Email) */}
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1.5">
                          <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                            <HiOutlinePhone className="text-slate-400" />
                            {patient.phone || (
                              <span className="text-slate-300 italic">
                                Trống
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-slate-500">
                            <HiOutlineMail className="text-slate-400" />
                            {patient.email || (
                              <span className="text-slate-300 italic">
                                Trống
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Ngày sinh & Giới tính */}
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1.5 items-start">
                          <p className="text-sm font-semibold text-slate-700">
                            {patient.dateOfBirth
                              ? dayjs(patient.dateOfBirth).format("DD/MM/YYYY")
                              : "Chưa cập nhật"}
                          </p>
                          {renderGender(patient.gender)}
                        </div>
                      </td>

                      {/* Địa chỉ */}
                      <td className="px-6 py-4">
                        <div className="flex items-start gap-1.5 text-sm text-slate-600 line-clamp-2">
                          <IoLocationOutline
                            className="text-slate-400 mt-0.5 shrink-0"
                            size="1.1rem"
                          />
                          <span>{patient.address || "Chưa cập nhật"}</span>
                        </div>
                      </td>

                      {/* Thao tác */}
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center ">
                          <button
                            className="p-2 text-green-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                            title="Xem thông tin"
                          >
                            <FaRegEye size="1.1rem" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  /* Trạng thái trống */
                  <tr>
                    <td colSpan="6" className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center justify-center text-slate-400">
                        <p className="text-lg font-bold text-slate-600 mb-1">
                          Không có bệnh nhân nào
                        </p>
                        <p className="text-sm">
                          Hệ thống hiện chưa có hồ sơ bệnh nhân nào được lưu
                          trữ.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ===== Phân trang ===== */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <Pagination
              setPage={setPage}
              totalPages={totalPages}
              currentPage={page}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default Patients;
