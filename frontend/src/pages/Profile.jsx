import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import defaultAvatar from '../assets/defaultAvatar.png'
import { CiCirclePlus } from "react-icons/ci";
import { IoIosSave } from "react-icons/io";
import { Validation } from "../utils/validation";
import { uploadImgCloudinary } from "../services/uploadImgCloudinary";
import { updateUser } from "../services/userService";
import { toast } from "react-toastify";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import _ from 'lodash'
import { getUserRedux } from "../redux/authSlice";
import dayjs from "dayjs";
dayjs.locale('vi')

function Profile() {
    const auth = useSelector(state => state.auth)
    const [imgUpload, setImgUpload] = useState(null)
    const [errors, setErrors] = useState({})
    const [isLoading, setIsLoading] = useState(false)
    const [payload, setPayload] = useState(auth.data || {})
    const dispatch = useDispatch()

    const handleImg = (e) => {
        const file = e.target.files[0]
        setPayload(prev => {
            return { ...prev, avatar: URL.createObjectURL(file) }
        })
        setImgUpload(file)
    }

    const handleClickSubmit = async () => {
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
            const {id,...rest} = _.cloneDeep(payload)
            const newPayload = {idUser:id,...rest}
            const res = await updateUser({ ...newPayload, avatar: linkImg })
            console.log("check res>>", res);

            if (res.err === 0) {
                toast.success(res.message)
                await dispatch(getUserRedux(id))
                setIsLoading(false)
            } else {
                toast.error(res.message)
                setIsLoading(false)
            }
        }
    }

    return (
        <div className="lg:px-40 md:px-20 px-5 flex">

            <div className="mt-5 pb-5 m-auto">
                <p className="text-xl font-semibold mb-10">Thông tin cá nhân</p>
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
                             value={payload.dateOfBirth ? dayjs(payload.dateOfBirth).format("YYYY-MM-DD") : ""}
                            onChange={(e) => { setPayload({ ...payload, dateOfBirth: e.target.value }) }}
                        />
                    </div>
                </div>
                <div className="mt-5">
                    <p className="">Hình ảnh</p>
                    <div className="flex justify-center">
                        <img className="size-24 object-cover object-center rounded-full"
                            alt="Avatar" src={(payload?.avatar == null) ? defaultAvatar : payload?.avatar}
                            onError={(e) => {
                                e.target.onerror = null; // Ngăn lặp vô hạn
                                e.target.src = defaultAvatar; // Đổi sang ảnh mặc định
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
                <div className="flex gap-5 mt-6 items-center">
                    <div className="w-1/2 mt-4 flex flex-col relative ">
                        <label>Email<span className="text-red-500">*</span></label>
                        <input className="border border-gray-500 rounded-md p-1" value={payload.email || ''}
                            onChange={(e) => { setPayload({ ...payload, email: e.target.value }) }} />
                        {errors.email && <small className="text-red-500 absolute -bottom-5">{errors.email}</small>}
                    </div>
                    <div className={`w-1/4 mt-4 flex flex-col`}>
                        <label>Mật khẩu</label>
                        <button className="py-1 px-2 rounded-lg bg-red-400 text-white cursor-pointer">Đổi mật khẩu</button>
                    </div>
                </div>

                <button className="text-white bg-blue-600 w-full flex justify-center items-center mt-10 py-2 rounded-lg"
                    onClick={() => { handleClickSubmit() }}
                >
                    {isLoading ? <span className="animate-rotate-center inline-block"><AiOutlineLoading3Quarters /></span> :
                        <div className="flex justify-center items-center gap-4">
                            <span><IoIosSave size={'1.25rem'} /></span>
                            <span className="text-lg font-semibold">Lưu thay đổi</span>
                        </div>}
                </button>
            </div>
        </div>
    );
}

export default Profile;