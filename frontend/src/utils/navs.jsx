import doctors from '../assets/doctors.png'
import packages from '../assets/packages.png'
import specialty from '../assets/specialty.png'
import { DOCTORS, MEDICAL_PACKAGE, SPECIALTY } from './path'

export const navs = [
    {
        name: "Chuyên khoa",
        title: "Tìm bác sĩ theo chuyên khoa",
        image: specialty,
        path: SPECIALTY
    },
    {
        name: "Bác sĩ",
        title: "Chọn bác sĩ giỏi",
        image: doctors,
        path: DOCTORS
    },
    {
        name: "Gói khám",
        title: "Khám sức khỏe tổng quát",
        image: packages,
        path: MEDICAL_PACKAGE
    },
]