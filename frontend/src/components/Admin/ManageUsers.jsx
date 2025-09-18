import { useState } from 'react';
import defaultAvatar from '../../assets/defaultAvatar.png'
import { FaRegPenToSquare } from "react-icons/fa6";
import { LuBadgePlus } from "react-icons/lu";
import { MdDeleteOutline } from "react-icons/md";

function ManageUsers() {
    const [isShowModal, setIsShowModal] = useState(false)
    const [type, setType] = useState('')
    return (
        <div className="mt-10 w-6xl mx-auto shadow-item px-4 py-4">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Danh sách tài khoản</h2>
                <button className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-lg cursor-pointer flex items-center gap-3">
                    <span>Thêm tài khoản</span>
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
                                <th className="p-4 text-sm font-normal leading-none text-slate-500">Email</th>
                                <th className="p-4 text-sm font-normal leading-none text-slate-500">Chức năng</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="hover:bg-slate-50">
                                <td className="p-4 border-b border-slate-200 py-5">
                                    <p className="block font-semibold text-sm text-slate-800">1</p>
                                </td>
                                <td className="p-4 border-b border-slate-200 py-5">
                                    <div className="size-16 rounded-full overflow-hidden">
                                        <img src={defaultAvatar} className="size-full object-center object-cover" />
                                    </div>
                                </td>
                                <td className="p-4 border-b border-slate-200 py-5">
                                    <p className="block font-semibold text-sm text-slate-800">Nguyễn Văn A</p>
                                </td>
                                <td className="p-4 border-b border-slate-200 py-5">
                                    <p className="text-sm text-slate-500">0856351909</p>
                                </td>
                                <td className="p-4 border-b border-slate-200 py-5">
                                    <p className="text-sm text-slate-500">bac03906@gmail.com</p>
                                </td>
                                <td className="p-4 py-5">
                                    <div className="flex items-center gap-4">
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
    );
}

export default ManageUsers;