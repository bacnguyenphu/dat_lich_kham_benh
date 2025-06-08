import { IoMdClose } from "react-icons/io";
import { CiCirclePlus } from "react-icons/ci";
import { useEffect, useState } from "react";
import { getPostions } from "../../services/positionService";
import { getSpecialties } from "../../services/specialtyService";
import DescriptionDetail from "./DescriptionDetail";
import imageAvatarDefault from '../../assets/defaultAvatar.png'
import { uploadImgCloudinary } from "../../services/uploadImgCloudinary";
import { createDoctor, deleteDoctorById, getDoctorById } from "../../services/doctorService";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment";

function ModalCRUDdoctor({ type, setIsShowModal, fectDoctors }) {

    const [postions, setPositions] = useState([])
    const [specialties, setSpecialties] = useState([])

    const [payload, setPayload] = useState({
        firstName: "",
        lastName: '',
        role: 'R2',
        phone: '',
        email: '',
        password: '',
        dateOfBirth: new Date().toISOString().split("T")[0],
        gender: 'male',
        address: '',
        avatar: null,
        price: '',
        description: '',
        id_specialty: [],
        id_position: [],
        description_detail: '',
    })

    const [imgUpload, setImgUpload] = useState() //cái này để upload lên cloudinary

    const navigate = useNavigate()
    const location = useLocation()
    const query = new URLSearchParams(location.search)
    const idDoctor = query.get("id")

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
        if (type !== "ADD") {
            if (postions.length > 0 && specialties.length > 0) {
                const fetchDataDoctor = async () => {
                    const res = await getDoctorById(idDoctor)
                    console.log(res);
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

    // console.log(payload);

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

    const handleClickAdd = async () => {
        let linkImg = null
        if (imgUpload) {
            let formData = new FormData()
            formData.append("file", imgUpload)
            formData.append("upload_preset", import.meta.env.VITE_UPLOAD_PRESET)
            const res = await uploadImgCloudinary(formData)
            linkImg = res.data.url
        }

        const res = await createDoctor({ ...payload, avatar: linkImg })
        console.log("check res: ", res);
        if (res.err === 0) {
            toast.success(res.message)
            setIsShowModal(false)
            navigate(location.pathname)
            fectDoctors()
        } else {
            toast.error(res.message)
        }
    }

    const handleClickDelete = async () => {
        const res = await deleteDoctorById(idDoctor)
        console.log('check res: ', res);
        if (res.err === 0) {
            setIsShowModal(false)
            navigate(location.pathname)
            toast.success(res.message)
            fectDoctors()
        } else {
            toast.error(res.message)
        }
    }

    const handleClickUpdate = () => {
        setIsShowModal(false)
        navigate(location.pathname)
    }

    const handleClickClose = () => {
        setIsShowModal(false)
        if (type !== "ADD") {
            navigate(location.pathname)
        }
    }

    return (
        <div className={`fixed left-0 right-0 top-0 bottom-0 bg-black/40`}>
            {(type === "VIEW" || type === "ADD" || type === "UPDATE") &&
                <div className="w-6xl bg-white min-h-6 rounded-2xl mx-auto mt-4 px-5">
                    <div className="flex justify-between py-3 border-b">
                        {type === "ADD" && <p className="text-xl font-semibold">Thêm bác sĩ</p>}
                        {type === "VIEW" && <p className="text-xl font-semibold">Thông tin bác sĩ</p>}
                        {type === "UPDATE" && <p className="text-xl font-semibold">Chỉnh sửa thông tin bác sĩ</p>}
                        <span className="cursor-pointer" onClick={() => handleClickClose()}><IoMdClose size={'1.5rem'} /></span>
                    </div>
                    <div className={`mt-5 pb-5 h-[550px] overflow-y-auto`} >
                        <div className="flex gap-6">
                            <div className="flex flex-col">
                                <label className="">
                                    Họ<span className="text-red-500">*</span>
                                </label>
                                <input disabled={type === "VIEW"} className="border border-gray-500 rounded-md p-1" value={payload.firstName || ''}
                                    onChange={(e) => { setPayload({ ...payload, firstName: e.target.value }) }}
                                />
                            </div>
                            <div className="flex flex-col">
                                <label>Tên<span className="text-red-500">*</span></label>
                                <input disabled={type === "VIEW"} className="border border-gray-500 rounded-md p-1" value={payload.lastName || ''}
                                    onChange={(e) => { setPayload({ ...payload, lastName: e.target.value }) }} />
                            </div>
                            <div className="flex flex-col">
                                <label>Số điện thoại<span className="text-red-500">*</span></label>
                                <input disabled={type === "VIEW"} className="border border-gray-500 rounded-md p-1" value={payload.phone || ''}
                                    onChange={(e) => { setPayload({ ...payload, phone: e.target.value }) }} />
                            </div>
                            <div className="flex flex-col">
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
                        <div className="flex gap-5 mt-4">
                            <div className="flex flex-col w-1/2">
                                <label>Địa chỉ<span className="text-red-500">*</span></label>
                                <input disabled={type === "VIEW"} className="border border-gray-500 rounded-md p-1 " value={payload.address || ''}
                                    onChange={(e) => { setPayload({ ...payload, address: e.target.value }) }} />
                            </div>
                            <div className="flex flex-col w-1/2">
                                <label>Ngày sinh<span className="text-red-500">*</span></label>
                                <input disabled={type === "VIEW"} className="border border-gray-500 rounded-md p-1 w-1/2" type="date"
                                    value={payload.dateOfBirth}
                                    onChange={(e) => { setPayload({ ...payload, dateOfBirth: e.target.value }) }}
                                />
                            </div>
                        </div>

                        <div className="flex gap-5">
                            <div className="w-1/2 mt-4 flex flex-col ">
                                <label>Email<span className="text-red-500">*</span></label>
                                <input disabled={type === "VIEW"} className="border border-gray-500 rounded-md p-1" value={payload.email || ''}
                                    onChange={(e) => { setPayload({ ...payload, email: e.target.value }) }} />
                            </div>
                            <div className="w-1/2 mt-4 flex flex-col ">
                                <label>Mật khẩu<span className="text-red-500">*</span></label>
                                <input disabled={type === "VIEW"} type="password" className="border border-gray-500 rounded-md p-1"
                                    onChange={(e) => { setPayload({ ...payload, password: e.target.value }) }} />
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
                        <div className="mt-4 flex flex-col ">
                            <label>Giá khám<span className="text-red-500">*</span></label>
                            <div className="w-2/5 border border-gray-500 rounded-md p-1 flex items-center">
                                <input disabled={type === "VIEW"} className="outline-none w-[85%]" value={payload.price || ''}
                                    onChange={(e) => { setPayload({ ...payload, price: e.target.value }) }} />
                                <span className="w-[15%] text-center border-l text-gray-400">VND</span>
                            </div>
                        </div>
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
                    <div className="flex gap-6 justify-end py-5 pr-5">
                        <button className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full cursor-pointer" onClick={() => handleClickClose()}>Thoát</button>
                        {type === "ADD" && <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full cursor-pointer" onClick={() => { handleClickAdd() }}>Thêm</button>}
                        {type === "UPDATE" && <button className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded-full cursor-pointer" onClick={() => { handleClickUpdate() }}>Sửa</button>}
                    </div>
                </div>
            }
            {type === "DELETE" &&
                <div className="w-2xl bg-white min-h-6 rounded-xl mx-auto mt-4 px-5 mt-10">
                    <div className="flex justify-between py-3 border-b">
                        <p className="text-xl font-semibold">Xóa bác sĩ</p>
                        <span className="cursor-pointer" onClick={() => handleClickClose()}><IoMdClose size={'1.5rem'} /></span>
                    </div>
                    <div className="p-5 h-48">
                        <p className="font-semibold">Bạn chắc có muốn xóa bác sĩ {payload.firstName} {payload.lastName} ?</p>
                        <div className="flex justify-center mt-10">
                            <img className="size-28 object-cover object-center rounded-full"
                                alt="Avatar" src={(payload?.avatar == null) ? imageAvatarDefault : payload?.avatar}
                                onError={(e) => {
                                    e.target.onerror = null; // Ngăn lặp vô hạn
                                    e.target.src = imageAvatarDefault; // Đổi sang ảnh mặc định
                                }}
                            />
                        </div>
                    </div>
                    <div className="flex gap-6 justify-end py-5 pr-5">
                        <button className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full cursor-pointer" onClick={() => handleClickClose()}>Thoát</button>
                        <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full cursor-pointer" onClick={() => { handleClickDelete() }}>Xóa</button>
                    </div>
                </div>
            }
        </div>
    );
}

export default ModalCRUDdoctor;