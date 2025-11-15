import { IoMdClose } from "react-icons/io";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useEffect, useState } from "react";
import { getPostions } from "../../services/positionService";
import { getSpecialties } from "../../services/specialtyService";
import imageAvatarDefault from '../../assets/defaultAvatar.png'
import { uploadImgCloudinary } from "../../services/uploadImgCloudinary";
import { createDoctor, deleteDoctorById, getDoctorById, updateDoctor } from "../../services/doctorService";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import { Validation } from "../../utils/validation";
import FormInfoDoctor from "../FormInfoDoctor";

function ModalCRUDdoctor({ type, setIsShowModal, fectDoctors }) {

    const [postions, setPositions] = useState([])
    const [specialties, setSpecialties] = useState([])
    const [errors, setErrors] = useState({})
    const [isLoading, setIsLoading] = useState(false)
    // const [scheduleOfDoctor, setScheduleOfDoctor] = useState([])

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

    // useEffect(() => {
    //     if (type === "VIEW" && idDoctor) {
    //         const fetchScheduleOfDoctor = async () => {
    //             const res = await getScheduleOfDoctor(idDoctor)
    //             if (res.err === 0) {
    //                 setScheduleOfDoctor(res.data)
    //             }
    //         }
    //         fetchScheduleOfDoctor()
    //     }
    // }, [idDoctor])

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
            const res = await createDoctor({ ...payload, avatar: linkImg })
            // console.log("check res: ", res);
            if (res.err === 0) {
                toast.success(res.message)
                setIsShowModal(false)
                navigate(location.pathname)
                fectDoctors()
                setIsLoading(false)
            } else {
                toast.error(res.message)
                setIsLoading(false)
            }
        }
    }

    const handleClickDelete = async () => {
        const res = await deleteDoctorById(idDoctor)
        if (res.err === 0) {
            setIsShowModal(false)
            navigate(location.pathname)
            toast.success(res.message)
            fectDoctors()
        } else {
            toast.error(res.message)
        }
    }

    const handleClickUpdate = async () => {
        // eslint-disable-next-line no-unused-vars
        const { password, ...other } = payload
        if (Validation(other, setErrors)) {
            setIsLoading(true)
            let linkImg = payload?.linkImg
            if (imgUpload) {
                let formData = new FormData()
                formData.append("file", imgUpload)
                formData.append("upload_preset", import.meta.env.VITE_UPLOAD_PRESET)
                const res = await uploadImgCloudinary(formData)
                linkImg = res.data.url
            }
            const res = await updateDoctor({ idDoctor, ...payload, avatar: linkImg })
            if (res.err === 0) {
                setIsShowModal(false)
                navigate(location.pathname)
                toast.success(res.message)
                fectDoctors()
                setIsLoading(false)
            } else {
                toast.error(res.message)
                setIsLoading(false)
            }
        }
    }

    const handleClickClose = () => {
        setIsShowModal(false)
        if (type !== "ADD") {
            navigate(location.pathname)
        }
    }

    return (
        <div className={`fixed left-0 right-0 top-0 bottom-0 bg-black/40`}>
            {(type !== "DELETE") &&
                <div className="w-6xl bg-white min-h-6 rounded-2xl mx-auto mt-4 px-5">
                    <div className="flex justify-between py-3 border-b">
                        {type === "ADD" && <p className="text-xl font-semibold">Thêm bác sĩ</p>}
                        {type === "VIEW" && <p className="text-xl font-semibold">Thông tin bác sĩ</p>}
                        {type === "UPDATE" && <p className="text-xl font-semibold">Chỉnh sửa thông tin bác sĩ</p>}
                        <span className="cursor-pointer" onClick={() => handleClickClose()}><IoMdClose size={'1.5rem'} /></span>
                    </div>
                    <div>
                        <FormInfoDoctor payload={payload} setPayload={setPayload}
                            idDoctor={idDoctor} setImgUpload={setImgUpload}
                            errors={errors} type={type}/>
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