import { LuBadgePlus } from "react-icons/lu";
import { FaRegEye } from "react-icons/fa";
import { FaRegPenToSquare } from "react-icons/fa6";
import { MdDeleteOutline } from "react-icons/md";
import { useState } from "react";
import ModalCRUDdoctor from "./ModalCRUDdoctor";

function InformationDoctor() {

    const [isShowModal, setIsShowModal] = useState(false)

    return (
        <>
            <div className="mt-10 w-6xl mx-auto shadow-item px-4 py-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Thông tin bác sĩ</h2>
                    <button className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-lg cursor-pointer flex items-center gap-3">
                        <span onClick={()=>{setIsShowModal(true)}}>Thêm bác sĩ</span>
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
                                <tr className="hover:bg-slate-50">
                                    <td className="p-4 border-b border-slate-200 py-5">
                                        <p className="block font-semibold text-sm text-slate-800">1</p>
                                    </td>
                                    <td className="p-4 border-b border-slate-200 py-5">
                                        <img src="https://demos.creative-tim.com/corporate-ui-dashboard-pro/assets/img/kam-idris-_HqHX3LBN18-unsplash.jpg" alt="Product 1" className="w-16 h-16 object-cover rounded" />
                                    </td>
                                    <td className="p-4 border-b border-slate-200 py-5">
                                        <p className="block font-semibold text-sm text-slate-800">Beautiful Chair</p>
                                    </td>
                                    <td className="p-4 border-b border-slate-200 py-5">
                                        <p className="text-sm text-slate-500">2</p>
                                    </td>
                                    <td className="p-4 border-b border-slate-200 py-5">
                                        <p className="text-sm text-slate-500">$500</p>
                                    </td>
                                    <td className="p-4 py-5">
                                        <div className="flex items-center gap-4">
                                            <span className="cursor-pointer"><FaRegEye size={"1.25rem"} color="green" /></span>
                                            <span className="cursor-pointer"><FaRegPenToSquare size={"1.25rem"} color="#EFB704" /></span>
                                            <span className="cursor-pointer"><MdDeleteOutline size={"1.5rem"} color="red" /></span>
                                        </div>

                                    </td>
                                </tr>

                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            {
                isShowModal && <ModalCRUDdoctor setIsShowModal={setIsShowModal}/>
            }
        </>

    );
}

export default InformationDoctor;