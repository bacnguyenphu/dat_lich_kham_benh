import { useState } from "react";
import { useSelector } from "react-redux";
import { FormInfoDoctor } from "../../components";
import { Validation } from "../../utils/validation";
import { uploadImgCloudinary } from "../../services/uploadImgCloudinary";
import { updateDoctor } from "../../services/doctorService";
import { toast } from "react-toastify";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

function MY_INFORMATION() {

    const [imgUpload, setImgUpload] = useState() //cái này để upload lên cloudinary
    const [errors, setErrors] = useState({})
    const [isLoading, setIsLoading] = useState(false)

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

    const idDoctor = useSelector(state => state?.authDoctor?.data?.id)

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
                toast.success("Cập nhập thông tin thành công")
                setIsLoading(false)
            } else {
                toast.error("Cập nhập thông tin thất bại")
                setIsLoading(false)
            }
        }
    }

    return (
        <div>
            <h3 className="text-2xl font-semibold">Thông tin của tôi</h3>
            <div>
                <FormInfoDoctor payload={payload} setPayload={setPayload}
                    idDoctor={idDoctor} setImgUpload={setImgUpload}
                    errors={errors} />
            </div>
            <div>
                <button className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded-full cursor-pointer w-full" onClick={() => { handleClickUpdate() }}>
                    {isLoading ? <span className="animate-rotate-center inline-block"><AiOutlineLoading3Quarters /></span> : <span>Lưu thông tin</span>}
                </button>
            </div>
        </div>
    );
}

export default MY_INFORMATION;