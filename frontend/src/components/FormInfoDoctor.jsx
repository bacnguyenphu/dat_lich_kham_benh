import { useEffect, useState } from "react";
import { getPostions } from "../services/positionService";
import { getSpecialties } from "../services/specialtyService";
import { getDoctorById } from "../services/doctorService";
import imageAvatarDefault from '../assets/defaultAvatar.png'
import DescriptionDetail from "./Admin/DescriptionDetail";
import { CiCirclePlus } from "react-icons/ci";

function FormInfoDoctor({ payload, setPayload, idDoctor, setImgUpload, type = "UPDATE", errors }) {

    const [postions, setPositions] = useState([])
    const [specialties, setSpecialties] = useState([])

    useEffect(() => {
        const fetchPostions = async () => {
            const res = await getPostions()
            if (res.err === 0) {
                setPositions(res.data)
            }
        }
        const fetchSpecialties = async () => {
            const res = await getSpecialties()
            if (res.err === 0) {
                setSpecialties(res.data)
            }
        }
        const fetchData = async () => {
            await Promise.all([fetchPostions(), fetchSpecialties()])
        }
        fetchData()
    }, [])

    useEffect(() => {
        if (idDoctor) {
            if (postions.length > 0 && specialties.length > 0) {
                const fetchDataDoctor = async () => {
                    const res = await getDoctorById(idDoctor)
                    if (res.err === 0) {
                        setPayload({
                            firstName: res?.data?.user?.firstName,
                            lastName: res?.data?.user?.lastName,
                            role: 'R2',
                            phone: res?.data?.user?.phone,
                            email: res?.data?.user?.email,
                            password: '',
                            dateOfBirth: res?.data?.user?.dateOfBirth?.split("T")[0],
                            gender: res?.data?.user?.gender,
                            address: res?.data?.user?.address,
                            avatar: res?.data?.user?.avatar,
                            price: res?.data?.price,
                            description: res?.data?.description,
                            id_specialty: res?.data?.specialty.map(item => item.id),
                            id_position: res?.data?.position.map(item => item.id),
                            description_detail: res?.data?.description_detail?.description || '',
                        })
                    }
                }
                fetchDataDoctor()
            }
        }

    }, [postions, specialties])

    const handleCheckbox = (e, type) => {
        const value = e.target.value
        if (type === "POSITION") {
            setPayload(prev => {
                return { ...prev, id_position: prev.id_position.includes(+value) ? prev.id_position.filter(item => item !== +value) : [...prev.id_position, +value] }
            })
        }
        if (type === "SPECIALTY") {
            setPayload(prev => {
                return { ...prev, id_specialty: prev.id_specialty.includes(value) ? prev.id_specialty.filter(item => item !== value) : [...prev.id_specialty, value] }
            })
        }
    }

    const handleImg = (e) => {
        const file = e.target.files[0]
        setPayload(prev => {
            return { ...prev, avatar: URL.createObjectURL(file) }
        })
        setImgUpload(file)
    }

    return (
        <div className={`mt-5 pb-5 h-[500px] overflow-y-auto`} >
            <div className="flex gap-6">
                <div className="flex flex-col relative">
                    <label className="">
                        Họ<span className="text-red-500">*</span>
                    </label>
                    <input disabled={type === "VIEW"} className="border border-gray-500 rounded-md p-1" value={payload.firstName || ''}
                        onChange={(e) => { setPayload({ ...payload, firstName: e.target.value }) }}
                    />
                    {errors.firstName && <small className="text-red-500 absolute -bottom-5">{errors.firstName}</small>}
                </div>
                <div className="flex flex-col relative">
                    <label>Tên<span className="text-red-500">*</span></label>
                    <input disabled={type === "VIEW"} className="border border-gray-500 rounded-md p-1" value={payload.lastName || ''}
                        onChange={(e) => { setPayload({ ...payload, lastName: e.target.value }) }} />
                    {errors.lastName && <small className="text-red-500 absolute -bottom-5">{errors.lastName}</small>}
                </div>
                <div className="flex flex-col relative">
                    <label>Số điện thoại<span className="text-red-500">*</span></label>
                    <input disabled={type === "VIEW"} className="border border-gray-500 rounded-md p-1" value={payload.phone || ''}
                        onChange={(e) => { setPayload({ ...payload, phone: e.target.value }) }} />
                    {errors.phone && <small className="text-red-500 absolute -bottom-5">{errors.phone}</small>}
                </div>
                <div className="flex flex-col relative">
                    <label>Giới tính<span className="text-red-500">*</span></label>
                    <div className="flex items-center gap-5">
                        <div className="flex gap-1">
                            <input disabled={type === "VIEW"} id="male" type="radio" name="gender" value={"male"} checked={payload.gender === "male"}
                                onChange={(e) => { setPayload({ ...payload, gender: e.target.value }) }} />
                            <label className="cursor-pointer" htmlFor="male">Nam</label>
                        </div>
                        <div className="flex gap-1">
                            <input disabled={type === "VIEW"} id="female" type="radio" name="gender" value={"female"} checked={payload.gender === "female"}
                                onChange={(e) => { setPayload({ ...payload, gender: e.target.value }) }} />
                            <label className="cursor-pointer" htmlFor="female">Nữ</label>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex gap-5 mt-6">
                <div className="flex flex-col relative w-1/2">
                    <label>Địa chỉ<span className="text-red-500">*</span></label>
                    <input disabled={type === "VIEW"} className="border border-gray-500 rounded-md p-1 " value={payload.address || ''}
                        onChange={(e) => { setPayload({ ...payload, address: e.target.value }) }} />
                    {errors.address && <small className="text-red-500 absolute -bottom-5">{errors.address}</small>}
                </div>
                <div className="flex flex-col relative w-1/2">
                    <label>Ngày sinh<span className="text-red-500">*</span></label>
                    <input disabled={type === "VIEW"} className="border border-gray-500 rounded-md p-1 w-1/2" type="date"
                        value={payload.dateOfBirth}
                        onChange={(e) => { setPayload({ ...payload, dateOfBirth: e.target.value }) }}
                    />
                </div>
            </div>

            <div className="flex gap-5 mt-6">
                <div className="w-1/2 mt-4 flex flex-col relative ">
                    <label>Email<span className="text-red-500">*</span></label>
                    <input disabled={type === "VIEW"} className="border border-gray-500 rounded-md p-1" value={payload.email || ''}
                        onChange={(e) => { setPayload({ ...payload, email: e.target.value }) }} />
                    {errors.email && <small className="text-red-500 absolute -bottom-5">{errors.email}</small>}
                </div>
                <div className={`w-1/2 mt-4 flex flex-col relative ${type !== "ADD" ? 'opacity-60 cursor-not-allowed' : ''}`}>
                    {(type !== "VIEW" && type !== "UPDATE") &&
                        <label>Mật khẩu<span className="text-red-500">*</span></label>
                    }
                    <input hidden={type === "VIEW" || type === "UPDATE"} type="password" className="border border-gray-500 rounded-md p-1"
                        onChange={(e) => { setPayload({ ...payload, password: e.target.value }) }} />
                    {errors.password && <small className="text-red-500 absolute -bottom-5">{errors.password}</small>}
                </div>
            </div>
            <div className="mt-5">
                <p>Hình ảnh</p>
                <div className="flex justify-center">
                    <img className="size-24 object-cover object-center rounded-full"
                        alt="Avatar" src={(payload?.avatar == null) ? imageAvatarDefault : payload?.avatar}
                        onError={(e) => {
                            e.target.onerror = null; // Ngăn lặp vô hạn
                            e.target.src = imageAvatarDefault; // Đổi sang ảnh mặc định
                        }}
                    />
                </div>
                <div className="flex justify-center mt-2">
                    <label className="flex items-center text-white gap-3 bg-green-500 rounded-lg px-2 py-1" htmlFor="uploadAvatar">
                        <p className="cursor-pointer">Tải ảnh lên</p>
                        <span><CiCirclePlus size={"1.25rem"} /></span>
                    </label>
                    <input disabled={type === "VIEW"} type="file" hidden id="uploadAvatar" onChange={(e) => { handleImg(e) }} />
                </div>
            </div>
            <div className="mt-4 flex flex-col relative ">
                <label>Giá khám<span className="text-red-500">*</span></label>
                <div className="w-2/5 border border-gray-500 rounded-md p-1 flex items-center">
                    <input disabled={type === "VIEW"} className="outline-none w-[85%]" value={payload.price || ''}
                        onChange={(e) => { setPayload({ ...payload, price: e.target.value }) }} />
                    <span className="w-[15%] text-center border-l text-gray-400">VND</span>
                </div>
                {errors.price && <small className="text-red-500 absolute -bottom-5">{errors.price}</small>}
            </div>
            {/* {type === "VIEW" &&
                <div className="mt-4 flex flex-col">
                    <label className="font-semibold">Lịch khám</label>
                    <div className="mt-4 flex flex-col gap-5">
                        {scheduleOfDoctor.length > 0 &&
                            scheduleOfDoctor.map(schedule => {
                                return (
                                    <div className="flex flex-col gap-2">
                                        <p className="text-blue-700 font-semibold text-xl">{dayjs(schedule?.appointment_date).format("DD/MM/YYYY")}</p>
                                        <div key={schedule.item} className=" grid grid-cols-5 gap-3">
                                            {schedule?.time_frame && schedule?.time_frame.length > 0 &&
                                                schedule.time_frame.map(item => {
                                                    return (
                                                        <div key={item?.id} className="bg-gray-200 text-center py-2 font-semibold text-sm cursor-pointer border-2 border-gray-200 duration-300">{item?.time_frame}</div>
                                                    )
                                                })
                                            }
                                        </div>
                                    </div>
                                )
                            })}
                        {scheduleOfDoctor.length === 0 &&
                            <p className="text-blue-700 font-semibold text-xl">Bác sĩ chưa có lịch khám !</p>
                        }
                    </div>
                </div>
            } */}
            <div className="mt-8 flex flex-col ">
                <p className="font-semibold">Chức vụ<span className="text-red-500 font-medium">*</span></p>
                <div className="grid grid-cols-5 gap-x-6 gap-y-3">
                    {postions.length > 0 &&
                        postions.map(item => {
                            return (
                                <div key={`position-checkbox-${item.id}`} className="flex items-center gap-2 ">
                                    <input disabled={type === "VIEW"} id={`position-checkbox-${item.id}`} className="cursor-pointer" type="checkbox" value={item.id} checked={payload.id_position.some(i => i === item.id)}
                                        onChange={(e) => { handleCheckbox(e, "POSITION") }} />
                                    <label htmlFor={`position-checkbox-${item.id}`} className="cursor-pointer">{item.name}</label>
                                </div>
                            )
                        })}
                </div>
            </div>
            <div className="mt-8 flex flex-col ">
                <p className="font-semibold">Chuyên khoa<span className="text-red-500 font-medium">*</span></p>
                <div className="grid grid-cols-5 gap-x-6 gap-y-3">
                    {specialties.length > 0 &&
                        specialties.map(item => {
                            return (
                                <div key={`position-checkbox-${item.id}`} className="flex items-center gap-2 ">
                                    <input disabled={type === "VIEW"} id={`position-checkbox-${item.id}`} className="cursor-pointer" type="checkbox" value={item.id} checked={payload.id_specialty.some(i => i === item.id)}
                                        onChange={(e) => { handleCheckbox(e, "SPECIALTY") }} />
                                    <label htmlFor={`position-checkbox-${item.id}`} className="cursor-pointer">{item.name}</label>
                                </div>
                            )
                        })}
                </div>
            </div>
            <div className="mt-8 flex flex-col ">
                <p className="font-semibold">Giới thiệu</p>
                <div className="">
                    <textarea disabled={type === "VIEW"} className="outline-none border border-gray-400 rounded-md w-3/4 h-72 p-2" value={payload.description || ''}
                        onChange={(e) => { setPayload({ ...payload, description: e.target.value }) }}></textarea>
                </div>
            </div>
            <div className="mt-8 flex flex-col ">
                <p className="font-semibold">Mô tả chi tiết<span className="text-red-500 font-medium">*</span></p>
                <div className="">
                    <DescriptionDetail type={type} payload={payload} setPayload={setPayload} />
                </div>
            </div>
        </div>
    );
}

export default FormInfoDoctor;