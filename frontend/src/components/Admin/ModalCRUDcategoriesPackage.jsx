import { useState } from "react";
import { IoMdClose } from "react-icons/io";
import imageAvatarDefault from '../../assets/default_image.webp'
import { CiCirclePlus } from "react-icons/ci";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { Validation } from "../../utils/validation";
import { uploadImgCloudinary } from "../../services/uploadImgCloudinary";
import { createCategoryPackage } from "../../services/categoryPackageService";
import { toast } from "react-toastify";

function ModalCRUDcategoriesPackage({ type, setIsShowModal, fetchCategoriesPackage }) {

    const [payload, setPayload] = useState({
        name: '',
        image: null,
        description: ''
    })
    const [imgUpload, setImgUpload] = useState()
    const [errors, setErrors] = useState({})
    const [isLoading, setIsLoading] = useState(false)

    const handleImg = (e) => {
        const file = e.target.files[0]
        setPayload(prev => {
            return { ...prev, image: URL.createObjectURL(file) }
        })
        setImgUpload(file)
    }

    const handleClickClose = () => {
        setIsShowModal(false)
        if (type !== "ADD") {
            navigate(location.pathname)
        }
    }

    const handleOnchange = (e) => {
        const { name, value } = e.target
        setPayload(prev => ({
            ...prev,
            [name]: value
        }))
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
            const res = await createCategoryPackage({ ...payload, linkImg: linkImg })
            if (res.err === 0) {
                fetchCategoriesPackage()
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

    return (
        <div className="fixed left-0 right-0 top-0 bottom-0 bg-black/40">
            <div className="w-5xl bg-white min-h-6 rounded-2xl mx-auto mt-10 px-5">
                <div className="flex justify-between py-3 border-b">
                    {type === "ADD" && <p className="text-xl font-semibold">Thêm danh mục gói khám</p>}
                    {type === "UPDATE" && <p className="text-xl font-semibold">Chỉnh sửa danh mục gói khám</p>}
                    <span className="cursor-pointer" onClick={() => handleClickClose()}><IoMdClose size={'1.5rem'} /></span>
                </div>
                <div className="mt-5 pb-5 h-[550px] overflow-y-auto">
                    <div className="flex flex-col relative">
                        <label>Tên danh mục gói khám<span className="text-red-500">*</span></label>
                        <input className="border border-gray-500 rounded-md p-1 w-8/12" name='name' value={payload.name} onChange={(e) => handleOnchange(e)} />
                        {errors.name && <small className="text-red-500 absolute -bottom-5">{errors.name}</small>}
                    </div>
                    <div className="mt-5">
                        <p>Hình ảnh</p>
                        <div className="flex justify-center">
                            <img className="size-24 object-cover object-center"
                                alt="Avatar" src={(payload?.image == null) ? imageAvatarDefault : payload?.image}
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
                        <p className="font-semibold">Giới thiệu</p>
                        <div className="">
                            <textarea className="outline-none border border-gray-400 rounded-md w-3/4 h-72 p-2"
                                name="description"
                                onChange={(e) => { handleOnchange(e) }}
                                value={payload.description || ''}></textarea>
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
            </div>
        </div>
    );
}

export default ModalCRUDcategoriesPackage;