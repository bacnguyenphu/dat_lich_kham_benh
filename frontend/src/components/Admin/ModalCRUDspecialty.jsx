import { IoMdClose } from "react-icons/io";
import imageAvatarDefault from '../../assets/defaultAvatar.png'
import { CiCirclePlus } from "react-icons/ci";
import { useState } from "react";
import DescriptionDetail from "./DescriptionDetail";
import { uploadImgCloudinary } from "../../services/uploadImgCloudinary";
import { createSpecialty, deleteSpecialty, getSpecialtyById } from "../../services/specialtyService";
import { Validation } from "../../utils/validation";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

function ModalCRUDspecialty({ setIsShowModal, type, fetchSpecialties }) {

    const [payload, setPayload] = useState({
        name: '',
        linkImg: null,
        description_detail: ''
    })
    const [errors, setErrors] = useState({})
    const [isLoading, setIsLoading] = useState(false)
    const [imgUpload, setImgUpload] = useState()

    const navigate = useNavigate()
    const location = useLocation()
    const query = new URLSearchParams(location.search)
    const id = query.get("id")

    useEffect(() => {
        if (type !== "ADD" && id !== null) {
            const fetchSpecialty = async () => {
                const res = await getSpecialtyById(id)
                if (res.err === 0) {
                    setPayload({
                        name: res?.data?.name,
                        linkImg: res?.data?.images,
                        description_detail: res?.data?.description_detail?.description
                    })
                }
            }
            fetchSpecialty()
        }
    }, [id])

    const handleClickClose = () => {
        setIsShowModal(false)
        navigate(location.pathname)
    }

    const handleImg = (e) => {
        const file = e.target.files[0]
        setPayload(prev => {
            return { ...prev, linkImg: URL.createObjectURL(file) }
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
            const res = await createSpecialty({ ...payload, linkImg: linkImg })
            if (res.err === 0) {
                fetchSpecialties()
                setIsShowModal(false)
                toast.success(res.message)
                setIsLoading(false)
            }
            else {
                toast.error(res.message)
                setIsLoading(false)
            }
        }
    }

    const handleClickDelete = async() => {
        const res = await deleteSpecialty(id)
        if(res.err==0){
            toast.success(res.message)
            setIsShowModal(false)
            navigate(location.pathname)
            fetchSpecialties()
        }
        else{
            toast.error(res.message)
        }
    }

    return (
        <div className="fixed left-0 right-0 top-0 bottom-0 bg-black/40">
            {(type !== "DELETE") &&
                <div className="w-5xl bg-white min-h-6 rounded-2xl mx-auto mt-10 px-5">
                    <div className="flex justify-between py-3 border-b">
                        <p className="text-xl font-semibold">Thêm chuyên khoa</p>
                        <span className="cursor-pointer" onClick={() => handleClickClose()}><IoMdClose size={'1.5rem'} /></span>
                    </div>
                    <div className="mt-5 pb-5 h-[550px] overflow-y-auto">
                        <div className="flex flex-col relative w-1/2">
                            <label>Tên chuyên khoa<span className="text-red-500">*</span></label>
                            <input className="border border-gray-500 rounded-md p-1" onChange={(e) => { setPayload({ ...payload, name: e.target.value }) }} />
                            {errors.name && <small className="text-red-500 absolute -bottom-5">{errors.name}</small>}
                        </div>
                        <div className="mt-5">
                            <p>Hình ảnh</p>
                            <div className="flex justify-center">
                                <img className="size-24 object-cover object-center rounded-full"
                                    alt="Avatar" src={(payload?.linkImg == null) ? imageAvatarDefault : payload?.linkImg}
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
                        <div className="mt-8 flex flex-col ">
                            <p className="font-semibold">Mô tả chi tiết<span className="text-red-500 font-medium">*</span></p>
                            <div className="w-full">
                                <DescriptionDetail type={type} payload={payload} setPayload={setPayload} />
                            </div>
                        </div>
                        <div className="flex gap-6 justify-end py-5 pr-5">
                            <button className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full cursor-pointer" onClick={() => handleClickClose()}>Thoát</button>
                            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full cursor-pointer" onClick={() => { handleClickAdd() }}>
                                {isLoading ? <span className="animate-rotate-center inline-block"><AiOutlineLoading3Quarters /></span> : <span>Thêm</span>}
                            </button>
                        </div>
                    </div>
                </div>
            }
            {type === "DELETE" &&
                <div className="w-2xl bg-white min-h-6 rounded-xl mx-auto px-5 mt-10">
                    <div className="flex justify-between py-3 border-b">
                        <p className="text-xl font-semibold">Xóa chuyên khoa</p>
                        <span className="cursor-pointer" onClick={() => handleClickClose()}><IoMdClose size={'1.5rem'} /></span>
                    </div>
                    <div className="p-5 h-48">
                        <p className="font-semibold">Bạn chắc có muốn xóa chuyên khoa {payload.name} ?</p>
                        <div className="flex justify-center mt-10">
                            <img className="size-28 object-cover object-center rounded-full"
                                alt="Avatar" src={(payload?.linkImg == null) ? imageAvatarDefault : payload?.linkImg}
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

export default ModalCRUDspecialty;