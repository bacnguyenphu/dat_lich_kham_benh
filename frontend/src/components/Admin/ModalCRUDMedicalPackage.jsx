import { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { useLocation, useNavigate } from "react-router-dom";
import { getCategoryPackage } from "../../services/categoryPackageService";
import DescriptionDetail from "./DescriptionDetail";
import imageAvatarDefault from '../../assets/default_image.webp'
import { CiCirclePlus } from "react-icons/ci";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { Validation } from "../../utils/validation";
import { uploadImgCloudinary } from "../../services/uploadImgCloudinary";
import { createMedicalPackage, deleteMedicalPackage, getMedicalPackageById, updateMedicalPackage } from "../../services/medicalPackageService";
import { toast } from "react-toastify";

function ModalCRUDMedicalPackage({ setIsShowModal, type, fetchMedicalPackages }) {

    const [categoriesPackage, setCategoriesPackage] = useState([])
    const [payload, setPayload] = useState({
        name: '',
        description_detail: '',
        price: '',
        image: null,
        description: '',
        id_category_package: ''
    })
    const [imgUpload, setImgUpload] = useState()
    const [errors, setErrors] = useState({})
    const [isLoading, setIsLoading] = useState(false)

    const navigate = useNavigate()
    const location = useLocation()
    const query = new URLSearchParams(location.search)
    const id = query.get("id")

    useEffect(() => {
        const fetchCategoriesPackage = async () => {
            const res = await getCategoryPackage()
            if (res.err == 0) {
                setCategoriesPackage(res.data)
            }
        }
        fetchCategoriesPackage()
    }, [])

    useEffect(() => {
        if (type !== "ADD"&&id) {
            const fetchMedicalPackageById = async () => {
                const res = await getMedicalPackageById(id)
                if (res.err === 0) {
                    setPayload({
                        ...payload,
                        name: res?.data?.name,
                        description_detail: res?.data?.description_detail?.description,
                        price: res?.data?.price,
                        image: res?.data?.image,
                        description: res?.data?.description,
                        id_category_package: res?.data?.category_package?.id
                    })
                }
            }
            fetchMedicalPackageById()
        }

    }, [id])

    const handleImg = (e) => {
        const file = e.target.files[0]
        setPayload(prev => {
            return { ...prev, image: URL.createObjectURL(file) }
        })
        setImgUpload(file)
    }

    const handleOnchange = (e) => {
        const { name, value } = e.target
        setPayload(prev => ({ ...prev, [name]: value }))
    }


    const handleClickClose = () => {
        setIsShowModal(false)
        if (type !== "ADD") {
            navigate(location.pathname)
        }
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
            const res = await createMedicalPackage({ ...payload, image: linkImg })
            // console.log("check res: ", res);
            if (res.err === 0) {
                toast.success(res.message)
                setIsShowModal(false)
                fetchMedicalPackages()
                setIsLoading(false)
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
            const res = await updateMedicalPackage({ ...payload, image: linkImg, idMedicalPackage: id })
            if (res.err === 0) {
                fetchMedicalPackages()
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

    const handleClickDelete = async () => {
        const res = await deleteMedicalPackage(id)
        if (res.err == 0) {
            toast.success(res.message)
            setIsShowModal(false)
            navigate(location.pathname)
            fetchMedicalPackages()
        }
        else {
            toast.error(res.message)
        }
    }

    return (
        <div className="fixed left-0 right-0 top-0 bottom-0 bg-black/40">
            <div className="w-5xl bg-white min-h-6 rounded-2xl mx-auto mt-10 px-5">
                <div className="flex justify-between py-3 border-b">
                    {type === "ADD" && <p className="text-xl font-semibold">Thêm gói khám</p>}
                    {type === "UPDATE" && <p className="text-xl font-semibold">Chỉnh sửa thông tin gói khám</p>}
                    {type === "DELETE" && <p className="text-xl font-semibold">Xóa gói khám</p>}
                    <span className="cursor-pointer" onClick={() => handleClickClose()}><IoMdClose size={'1.5rem'} /></span>
                </div>
                {type !== "DELETE" &&
                    <div className="mt-5 pb-5 h-[500px] overflow-y-auto flex flex-col gap-5">
                        <div className="flex flex-col gap-1 relative">
                            <label>Tên gói khám<span className="text-red-500">*</span></label>
                            <input className="border border-gray-500 rounded-md p-1 w-3/4" name="name" value={payload.name} onChange={(e) => { handleOnchange(e) }} />
                            {errors.name && <small className="text-red-500 absolute -bottom-5">{errors.name}</small>}
                        </div>
                        <div className="flex flex-col gap-1 relative">
                            <label>Danh mục gói khám<span className="text-red-500">*</span></label>
                            <div className="grid grid-cols-4 gap-y-2 mt-2">
                                {categoriesPackage.length > 0 &&
                                    categoriesPackage.map(item => {
                                        return (
                                            <div key={item.id} className="flex items-center gap-1">
                                                <input type="radio" id={item.id} name="id_category_package" value={item.id} checked={payload.id_category_package === item?.id} onChange={(e) => { handleOnchange(e) }} />
                                                <label htmlFor={item.id} className="text-sm">{item.name}</label>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                            {errors.id_category_package && <small className="text-red-500 absolute -bottom-5">{errors.id_category_package}</small>}
                        </div>
                        <div className="flex flex-col gap-1 relative">
                            <label>Giá khám<span className="text-red-500">*</span></label>
                            <input className="border border-gray-500 rounded-md p-1 w-2/4" name="price" value={payload.price} onChange={(e) => { handleOnchange(e) }} />
                            {errors.price && <small className="text-red-500 absolute -bottom-5">{errors.price}</small>}
                        </div>
                        <div className="">
                            <p>Hình ảnh</p>
                            <div className="flex justify-center">
                                <img className="h-24 w-32 object-cover object-center"
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
                        <div className="flex flex-col ">
                            <p className="font-semibold">Giới thiệu</p>
                            <div className="">
                                <textarea className="outline-none border border-gray-400 rounded-md w-3/4 h-72 p-2"
                                    name="description"
                                    onChange={(e) => { handleOnchange(e) }}
                                    value={payload.description || ''}></textarea>
                            </div>
                        </div>
                        <div className="flex flex-col gap-1">
                            <label>Mô tả chi tiết</label>
                            <DescriptionDetail type={type} payload={payload} setPayload={setPayload} />
                        </div>
                    </div>
                }
                {type === "DELETE" &&
                    <div className="mt-5 pb-5 h-[350px] overflow-y-auto flex flex-col gap-5">
                        <h4 className="text-xl font-semibold">Bạn chắc có muốn xóa gói khám này ?</h4>
                        <div className="flex gap-5 items-center">
                            <label>Tên gói khám: </label>
                            <p className="text-lg">{payload.name}</p>
                        </div>
                        <div className="mt-5">
                            <p>Hình ảnh:</p>
                            <div className="flex justify-center">
                                <img className="h-36 w-48 object-cover object-center"
                                    alt="Avatar" src={(payload?.image == null) ? imageAvatarDefault : payload?.image}
                                    onError={(e) => {
                                        e.target.onerror = null; // Ngăn lặp vô hạn
                                        e.target.src = imageAvatarDefault; // Đổi sang ảnh mặc định
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                }
                <div className="flex gap-6 justify-end py-5 pr-5">
                    <button className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full cursor-pointer" onClick={() => handleClickClose()}>Thoát</button>
                    {type === "ADD" && <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full cursor-pointer" onClick={() => { handleClickAdd() }}>
                        {isLoading ? <span className="animate-rotate-center inline-block"><AiOutlineLoading3Quarters /></span> : <span>Thêm</span>}
                    </button>}
                    {type === "UPDATE" && <button className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded-full cursor-pointer" onClick={() => { handleClickUpdate() }}>
                        {isLoading ? <span className="animate-rotate-center inline-block"><AiOutlineLoading3Quarters /></span> : <span>Sửa</span>}
                    </button>}
                    {type === "DELETE" && <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full cursor-pointer" onClick={() => { handleClickDelete() }}>Xóa</button>}
                </div>
            </div>
        </div>
    );
}

export default ModalCRUDMedicalPackage;