import { useEffect, useState } from "react";
import { getPostions } from "../services/positionService";
import { getSpecialties } from "../services/specialtyService";
import { getDoctorById } from "../services/doctorService";
import imageAvatarDefault from "../assets/defaultAvatar.png";
import DescriptionDetail from "./Admin/DescriptionDetail";
import { TbCameraPlus } from "react-icons/tb";
import {
  FaUserMd,
  FaIdCard,
  FaStethoscope,
  FaBriefcaseMedical,
} from "react-icons/fa";

function FormInfoDoctor({
  payload,
  setPayload,
  idDoctor,
  setImgUpload,
  type = "UPDATE",
  errors,
}) {
  const [postions, setPositions] = useState([]);
  const [specialties, setSpecialties] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const [resPos, resSpec] = await Promise.all([
        getPostions(),
        getSpecialties(),
      ]);
      if (resPos.err === 0) setPositions(resPos.data);
      if (resSpec.err === 0) setSpecialties(resSpec.data);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (idDoctor && postions.length > 0 && specialties.length > 0) {
      const fetchDataDoctor = async () => {
        const res = await getDoctorById(idDoctor);
        if (res.err === 0) {
          setPayload({
            firstName: res?.data?.user?.firstName,
            lastName: res?.data?.user?.lastName,
            role: "R2",
            phone: res?.data?.user?.phone,
            email: res?.data?.user?.email,
            password: "",
            dateOfBirth: res?.data?.user?.dateOfBirth?.split("T")[0],
            gender: res?.data?.user?.gender,
            address: res?.data?.user?.address,
            avatar: res?.data?.user?.avatar,
            price: res?.data?.price,
            description: res?.data?.description,
            id_specialty: res?.data?.specialty.map((item) => item.id),
            id_position: res?.data?.position.map((item) => item.id),
            description_detail:
              res?.data?.description_detail?.description || "",
          });
        }
      };
      fetchDataDoctor();
    }
  }, [idDoctor, postions, specialties]);

  const handleCheckbox = (value, category) => {
    if (type === "VIEW") return;
    const key = category === "POSITION" ? "id_position" : "id_specialty";
    const numericValue = category === "POSITION" ? +value : value;

    setPayload((prev) => ({
      ...prev,
      [key]: prev[key].includes(numericValue)
        ? prev[key].filter((item) => item !== numericValue)
        : [...prev[key], numericValue],
    }));
  };

  const handleImg = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPayload((prev) => ({ ...prev, avatar: URL.createObjectURL(file) }));
      setImgUpload(file);
    }
  };

  const inputClass = (error) => `
        w-full border rounded-xl p-2.5 transition-all outline-none
        ${type === "VIEW" ? "bg-slate-50 border-transparent text-slate-800 font-medium" : "bg-white border-slate-300 focus:ring-2 focus:ring-blue-500"}
        ${error ? "border-red-400 bg-red-50" : ""}
    `;

  return (
    <div className="flex flex-col gap-10 pb-10">
      {/* SECTION 1: AVATAR & BASIC INFO */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="flex flex-col items-center gap-3">
          <div className="relative group">
            <div className="size-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-slate-100">
              <img
                className="w-full h-full object-cover"
                alt="Doctor Avatar"
                src={payload?.avatar || imageAvatarDefault}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = imageAvatarDefault;
                }}
              />
            </div>
            {type !== "VIEW" && (
              <label
                htmlFor="uploadAvatar"
                className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full shadow-md cursor-pointer hover:bg-blue-700 transition-all"
              >
                <TbCameraPlus size="1.2rem" />
              </label>
            )}
            <input type="file" hidden id="uploadAvatar" onChange={handleImg} />
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Ảnh đại diện
          </p>
        </div>

        <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <FaIdCard className="text-blue-500" /> Họ{" "}
              <span className="text-red-500">*</span>
            </label>
            <input
              disabled={type === "VIEW"}
              className={inputClass(errors.firstName)}
              value={payload.firstName || ""}
              onChange={(e) =>
                setPayload({ ...payload, firstName: e.target.value })
              }
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-slate-700">
              Tên <span className="text-red-500">*</span>
            </label>
            <input
              disabled={type === "VIEW"}
              className={inputClass(errors.lastName)}
              value={payload.lastName || ""}
              onChange={(e) =>
                setPayload({ ...payload, lastName: e.target.value })
              }
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-slate-700">
              Số điện thoại <span className="text-red-500">*</span>
            </label>
            <input
              disabled={type === "VIEW"}
              className={inputClass(errors.phone)}
              value={payload.phone || ""}
              onChange={(e) =>
                setPayload({ ...payload, phone: e.target.value })
              }
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-slate-700">
              Giới tính <span className="text-red-500">*</span>
            </label>
            <div
              className={`flex items-center gap-6 p-2.5 rounded-xl ${type === "VIEW" ? "bg-slate-50" : "bg-white border border-slate-300"}`}
            >
              <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-600">
                <input
                  disabled={type === "VIEW"}
                  type="radio"
                  name="gender"
                  value="male"
                  checked={payload.gender === "male"}
                  onChange={(e) =>
                    setPayload({ ...prev, gender: e.target.value })
                  }
                />{" "}
                Nam
              </label>
              <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-600">
                <input
                  disabled={type === "VIEW"}
                  type="radio"
                  name="gender"
                  value="female"
                  checked={payload.gender === "female"}
                  onChange={(e) =>
                    setPayload({ ...prev, gender: e.target.value })
                  }
                />{" "}
                Nữ
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: ACCOUNT & PRICE */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-2xl border border-slate-100">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-slate-700">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              disabled={type === "VIEW"}
              className={inputClass(errors.email)}
              value={payload.email || ""}
              onChange={(e) =>
                setPayload({ ...payload, email: e.target.value })
              }
            />
          </div>
          {type === "ADD" && (
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-slate-700">
                Mật khẩu <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                className={inputClass(errors.password)}
                onChange={(e) =>
                  setPayload({ ...payload, password: e.target.value })
                }
              />
            </div>
          )}
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-slate-700">
              Giá khám (VNĐ) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                disabled={type === "VIEW"}
                className={`${inputClass(errors.price)} pr-12`}
                value={payload.price || ""}
                onChange={(e) =>
                  setPayload({ ...payload, price: e.target.value })
                }
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs uppercase">
                VNĐ
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-slate-700">
              Ngày sinh <span className="text-red-500">*</span>
            </label>
            <input
              disabled={type === "VIEW"}
              type="date"
              className={inputClass()}
              value={payload.dateOfBirth || ""}
              onChange={(e) =>
                setPayload({ ...payload, dateOfBirth: e.target.value })
              }
            />
          </div>
        </div>
        <div className="md:col-span-2 flex flex-col gap-1.5">
          <label className="text-sm font-bold text-slate-700">
            Địa chỉ cư trú <span className="text-red-500">*</span>
          </label>
          <input
            disabled={type === "VIEW"}
            className={inputClass(errors.address)}
            value={payload.address || ""}
            onChange={(e) =>
              setPayload({ ...payload, address: e.target.value })
            }
          />
        </div>
      </div>

      {/* SECTION 3: PROFESSIONAL INFO (CHECKBOXES AS TAGS) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Positions */}
        <div className="flex flex-col gap-4">
          <h3 className="font-bold text-slate-800 flex items-center gap-2 border-l-4 border-blue-500 pl-3">
            <FaUserMd /> Chức vụ chuyên môn
          </h3>
          <div className="flex flex-wrap gap-2">
            {postions.map((item) => (
              <div
                key={item.id}
                onClick={() => handleCheckbox(item.id, "POSITION")}
                className={`px-4 py-2 rounded-full border text-sm font-bold transition-all select-none cursor-pointer
                                    ${
                                      payload.id_position.includes(item.id)
                                        ? "bg-blue-600 border-blue-600 text-white shadow-md"
                                        : "bg-white border-slate-200 text-slate-500 hover:border-blue-400"
                                    } ${type === "VIEW" ? "cursor-default" : "active:scale-95"}`}
              >
                {item.name}
              </div>
            ))}
          </div>
        </div>

        {/* Specialties */}
        <div className="flex flex-col gap-4">
          <h3 className="font-bold text-slate-800 flex items-center gap-2 border-l-4 border-emerald-500 pl-3">
            <FaStethoscope /> Chuyên khoa đảm nhận
          </h3>
          <div className="flex flex-wrap gap-2">
            {specialties.map((item) => (
              <div
                key={item.id}
                onClick={() => handleCheckbox(item.id, "SPECIALTY")}
                className={`px-4 py-2 rounded-full border text-sm font-bold transition-all select-none cursor-pointer
                                    ${
                                      payload.id_specialty.includes(item.id)
                                        ? "bg-emerald-600 border-emerald-600 text-white shadow-md"
                                        : "bg-white border-slate-200 text-slate-500 hover:border-emerald-400"
                                    } ${type === "VIEW" ? "cursor-default" : "active:scale-95"}`}
              >
                {item.name}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 4: INTRO & DETAIL */}
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <FaBriefcaseMedical className="text-slate-400" /> Giới thiệu ngắn
          </h3>
          <textarea
            disabled={type === "VIEW"}
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 min-h-[150px] outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-700 leading-relaxed"
            value={payload.description || ""}
            placeholder="VD: Bác sĩ có hơn 10 năm kinh nghiệm trong lĩnh vực..."
            onChange={(e) =>
              setPayload({ ...payload, description: e.target.value })
            }
          />
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="font-bold text-slate-800">
            Thông tin bài viết chi tiết
          </h3>
          <div
            className={`rounded-2xl overflow-hidden border border-slate-200 shadow-sm ${type === "VIEW" ? "pointer-events-none opacity-90" : ""}`}
          >
            <DescriptionDetail
              type={type}
              payload={payload}
              setPayload={setPayload}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default FormInfoDoctor;
