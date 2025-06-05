import { LuBadgePlus } from "react-icons/lu";
import { FaRegEye } from "react-icons/fa";
import { FaRegPenToSquare } from "react-icons/fa6";
import { MdDeleteOutline } from "react-icons/md";
import { useState } from "react";
import ModalCRUDdoctor from "./ModalCRUDdoctor";
import { getDoctors } from "../../services/doctorService";
import { useEffect } from "react";
import moment from "moment";

function InformationDoctor() {

    const [isShowModal, setIsShowModal] = useState(false)
    const [doctors, setDoctors] = useState([])

    useEffect(() => {
        const fectDoctors = async () => {
            const res = await getDoctors()
            if (res.err === 0) {
                setDoctors(res.data)
            }
        }

        fectDoctors();
    }, [])

    console.log(doctors);


    return (
        <>
            <div className="mt-10 w-6xl mx-auto shadow-item px-4 py-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Thông tin bác sĩ</h2>
                    <button className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-lg cursor-pointer flex items-center gap-3">
                        <span onClick={() => { setIsShowModal(true) }}>Thêm bác sĩ</span>
                        <span><LuBadgePlus size={"1.25rem"} /></span>
                    </button>
                </div>
                <div className="mt-5">
                    <div className="relative flex flex-col w-full h-full text-gray-700 bg-white shadow-md rounded-lg bg-clip-border">
                        <table className="w-full text-left table-auto min-w-max">
                            <thead>
                                <tr className="border-b border-slate-300 bg-slate-50">
                                    <th className="p-4 text-sm font-normal leading-none text-slate-500">STT</th>
                                    <th className="p-4 text-sm font-normal leading-none text-slate-500">Ảnh</th>
                                    <th className="p-4 text-sm font-normal leading-none text-slate-500">Họ tên</th>
                                    <th className="p-4 text-sm font-normal leading-none text-slate-500">Số điện thoại</th>
                                    <th className="p-4 text-sm font-normal leading-none text-slate-500">Ngày chỉnh sửa</th>
                                    <th className="p-4 text-sm font-normal leading-none text-slate-500">Chức năng</th>
                                </tr>
                            </thead>
                            <tbody>
                                {doctors.length > 0 && doctors.map((doctor, index) => {
                                    return (
                                        <tr className="hover:bg-slate-50" key={doctor.id}>
                                            <td className="p-4 border-b border-slate-200 py-5">
                                                <p className="block font-semibold text-sm text-slate-800">{index + 1}</p>
                                            </td>
                                            <td className="p-4 border-b border-slate-200 py-5">
                                                <div className="size-16 rounded-full overflow-hidden">
                                                    <img src={doctor?.user?.avatar} className="size-full object-center object-cover"/>
                                                </div>
                                            </td>
                                            <td className="p-4 border-b border-slate-200 py-5">
                                                <p className="block font-semibold text-sm text-slate-800">{doctor?.user?.firstName} {doctor?.user?.lastName}</p>
                                            </td>
                                            <td className="p-4 border-b border-slate-200 py-5">
                                                <p className="text-sm text-slate-500">{doctor?.user?.phone}</p>
                                            </td>
                                            <td className="p-4 border-b border-slate-200 py-5">
                                                <p className="text-sm text-slate-500">{moment(doctor.updatedAt).format("DD/MM/YYYY")}</p>
                                            </td>
                                            <td className="p-4 py-5">
                                                <div className="flex items-center gap-4">
                                                    <span className="cursor-pointer"><FaRegEye size={"1.25rem"} color="green" /></span>
                                                    <span className="cursor-pointer"><FaRegPenToSquare size={"1.25rem"} color="#EFB704" /></span>
                                                    <span className="cursor-pointer"><MdDeleteOutline size={"1.5rem"} color="red" /></span>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            {
                isShowModal && <ModalCRUDdoctor setIsShowModal={setIsShowModal} />
            }
        </>

    );
}

export default InformationDoctor;