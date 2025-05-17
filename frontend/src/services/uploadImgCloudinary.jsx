import axios from "axios"

const uploadImgCloudinary = (formData)=>{
    return axios.post(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUD_NAME}/image/upload`,formData)
}

export {uploadImgCloudinary}