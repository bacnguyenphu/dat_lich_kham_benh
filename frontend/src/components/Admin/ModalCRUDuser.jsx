import { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { useLocation, useNavigate } from "react-router-dom";
import imageAvatarDefault from '../../assets/defaultAvatar.png'
import { CiCirclePlus } from "react-icons/ci";
import { Validation } from "../../utils/validation";
import { uploadImgCloudinary } from "../../services/uploadImgCloudinary";
import { register } from "../../services/authService";
import { toast } from "react-toastify";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { deleteUserById, getUserById, updateUser } from "../../services/userService";

function ModalCRUDuser({ type, setIsShowModal, fetchUsers }) {
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)

    const [imgUpload, setImgUpload] = useState() //cái này để upload lên cloudinary

    const location = useLocation()
    const query = new URLSearchParams(location.search)
    const idUser = query.get("id")

    const [errors, setErrors] = useState({})
    const [payload, setPayload] = useState({
        firstName: "",
        lastName: '',
        phone: '',
        email: '',
        password: '',
        dateOfBirth: new Date().toISOString().split("T")[0],
        gender: 'male',
        address: '',
        avatar: null,
    })

    useEffect(() => {
        if (type !== "ADD" && idUser) {

            const fetchDataUser = async () => {
                const res = await getUserById(idUser)
                if (res.err === 0) {
                    setPayload({
                        firstName: res?.data?.firstName,
                        lastName: res?.data?.lastName,
                        phone: res?.data?.phone,
                        email: res?.data?.email,
                        dateOfBirth: res?.data?.dateOfBirth?.split("T")[0],
                        gender: res?.data?.gender || "male",
                        address: res?.data?.address,
                        avatar: res?.data?.avatar,
                    })
                }
            }
            fetchDataUser()
        }
    }, [idUser])

    const handleImg = (e) => {
        const file = e.target.files[0]
        setPayload(prev => {
            return { ...prev, avatar: URL.createObjectURL(file) }
        })
        setImgUpload(file)
    }

    const handleClickAdd = async () => {
        if (Validation(payload, setErrors)) {
            setIsLoading(true)
            let linkImg = null
            if (imgUpload) {
                let formData = new FormData()
                formData.append("file", imgUpload)
                formData.append("upload_preset", import.meta.env.VITE_UPLOAD_PRESET)
                const res = await uploadImgCloudinary(formData)
                linkImg = res.data.url
            }

            const res = await register({ ...payload, avatar: linkImg })
            if (res.err === 0) {
                toast.success("Thêm thành công")
                setIsShowModal(false)
                navigate(location.pathname)
                setIsLoading(false)
                fetchUsers()
            } else {
                toast.error(res.message)
                setIsLoading(false)
            }
        }
    }

    const handleClickUpdate = async () => {
        if (Validation(payload, setErrors)) {
            setIsLoading(true)
            let linkImg = payload?.linkImg
            if (imgUpload) {
                let formData = new FormData()
                formData.append("file", imgUpload)
                formData.append("upload_preset", import.meta.env.VITE_UPLOAD_PRESET)
                const res = await uploadImgCloudinary(formData)
                linkImg = res.data.url
            }
            const res = await updateUser({ idUser, ...payload, avatar: linkImg })

            if (res.err === 0) {
                setIsShowModal(false)
                navigate(location.pathname)
                toast.success(res.message)
                fetchUsers()
                setIsLoading(false)
            } else {
                toast.error(res.message)
                setIsLoading(false)
            }
        }
    }

    const handleClickDelete = async () => {
        const res = await deleteUserById(idUser)
        if (res.err === 0) {
            setIsShowModal(false)
            navigate(location.pathname)
            toast.success(res.message)
            fetchUsers()
        } else {
            toast.error(res.message)
        }
    }

    const handleClickClose = () => {
        setIsShowModal(false)
        if (type !== "ADD") {
            navigate(location.pathname)
        }
    }

    return (
        <div className="fixed left-0 right-0 top-0 bottom-0 bg-black/40">
            {(type !== "DELETE") &&
                <div className="w-5xl bg-white min-h-6 rounded-2xl mx-auto mt-4 px-5">
                    <div className="flex justify-between py-3 border-b">
                        {type === "ADD" && <p className="text-xl font-semibold">Thêm người dùng</p>}
                        {type === "UPDATE" && <p className="text-xl font-semibold">Chỉnh sửa thông tin bác sĩ</p>}
                        <span className="cursor-pointer" onClick={() => handleClickClose()}><IoMdClose size={'1.5rem'} /></span>
                    </div>
                    <div className="mt-5 pb-5 h-[450px] overflow-y-auto">
                        <div className="flex gap-6">
                            <div className="flex flex-col relative">
                                <label className="">
                                    Họ<span className="text-red-500">*</span>
                                </label>
                                <input className="border border-gray-500 rounded-md p-1" value={payload.firstName || ''}
                                    onChange={(e) => { setPayload({ ...payload, firstName: e.target.value }) }}
                                />
                                {errors.firstName && <small className="text-red-500 absolute -bottom-5">{errors.firstName}</small>}
                            </div>
                            <div className="flex flex-col relative">
                                <label>Tên<span className="text-red-500">*</span></label>
                                <input className="border border-gray-500 rounded-md p-1" value={payload.lastName || ''}
                                    onChange={(e) => { setPayload({ ...payload, lastName: e.target.value }) }} />
                                {errors.lastName && <small className="text-red-500 absolute -bottom-5">{errors.lastName}</small>}
                            </div>
                            <div className="flex flex-col relative">
                                <label>Số điện thoại<span className="text-red-500">*</span></label>
                                <input className="border border-gray-500 rounded-md p-1" value={payload.phone || ''}
                                    onChange={(e) => { setPayload({ ...payload, phone: e.target.value }) }} />
                                {errors.phone && <small className="text-red-500 absolute -bottom-5">{errors.phone}</small>}
                            </div>
                            <div className="flex flex-col relative">
                                <label>Giới tính<span className="text-red-500">*</span></label>
                                <div className="flex items-center gap-5">
                                    <div className="flex gap-1">
                                        <input id="male" type="radio" name="gender" value={"male"} checked={payload.gender === "male"}
                                            onChange={(e) => { setPayload({ ...payload, gender: e.target.value }) }} />
                                        <label className="cursor-pointer" htmlFor="male">Nam</label>
                                    </div>
                                    <div className="flex gap-1">
                                        <input id="female" type="radio" name="gender" value={"female"} checked={payload.gender === "female"}
                                            onChange={(e) => { setPayload({ ...payload, gender: e.target.value }) }} />
                                        <label className="cursor-pointer" htmlFor="female">Nữ</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-5 mt-6">
                            <div className="flex flex-col relative w-1/2">
                                <label>Địa chỉ<span className="text-red-500">*</span></label>
                                <input className="border border-gray-500 rounded-md p-1 " value={payload.address || ''}
                                    onChange={(e) => { setPayload({ ...payload, address: e.target.value }) }} />
                                {errors.address && <small className="text-red-500 absolute -bottom-5">{errors.address}</small>}
                            </div>
                            <div className="flex flex-col relative w-1/2">
                                <label>Ngày sinh<span className="text-red-500">*</span></label>
                                <input className="border border-gray-500 rounded-md p-1 w-1/2" type="date"
                                    value={payload.dateOfBirth}
                                    onChange={(e) => { setPayload({ ...payload, dateOfBirth: e.target.value }) }}
                                />
                            </div>
                        </div>
                        <div className="flex gap-5 mt-6">
                            <div className="w-1/2 mt-4 flex flex-col relative ">
                                <label>Email<span className="text-red-500">*</span></label>
                                <input className="border border-gray-500 rounded-md p-1" value={payload.email || ''}
                                    onChange={(e) => { setPayload({ ...payload, email: e.target.value }) }} />
                                {errors.email && <small className="text-red-500 absolute -bottom-5">{errors.email}</small>}
                            </div>
                            <div className={`w-1/2 mt-4 flex flex-col relative ${type !== "ADD" ? 'opacity-60 cursor-not-allowed' : ''}`}>
                                <label>Mật khẩu<span className="text-red-500">*</span></label>
                                <input disabled={type !== "ADD"} type="password" className="border border-gray-500 rounded-md p-1"
                                    onChange={(e) => { setPayload({ ...payload, password: e.target.value }) }} />
                                {errors.password && <small className="text-red-500 absolute -bottom-5">{errors.password}</small>}
                            </div>
                        </div>
                        <div className="mt-5">
                            <p className="">Hình ảnh</p>
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
                                <input type="file" hidden id="uploadAvatar" onChange={(e) => { handleImg(e) }} />
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-6 justify-end py-5 pr-5">
                        <button className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full cursor-pointer" onClick={() => handleClickClose()}>Thoát</button>
                        {type === "ADD" && <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full cursor-pointer" onClick={() => { handleClickAdd() }}>
                            {isLoading ? <span className="animate-rotate-center inline-block"><AiOutlineLoading3Quarters /></span> : <span>Thêm</span>}
                        </button>}
                        {type === "UPDATE" && <button className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded-full cursor-pointer" onClick={() => { handleClickUpdate() }}>
                            {isLoading ? <span className="animate-rotate-center inline-block"><AiOutlineLoading3Quarters /></span> : <span>Sửa</span>}
                        </button>}
                    </div>
                </div>
            }
            {type === "DELETE" &&
                <div className="w-2xl bg-white min-h-6 rounded-xl mx-auto px-5 mt-10">
                    <div className="flex justify-between py-3 border-b">
                        <p className="text-xl font-semibold">Xóa bác sĩ</p>
                        <span className="cursor-pointer" onClick={() => handleClickClose()}><IoMdClose size={'1.5rem'} /></span>
                    </div>
                    <div className="p-5 h-48">
                        <p className="font-semibold">Bạn chắc có muốn xóa người dùng {payload.firstName} {payload.lastName} ?</p>
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

export default ModalCRUDuser;