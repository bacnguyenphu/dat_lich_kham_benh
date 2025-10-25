import { FaRegEye, FaRegPenToSquare } from "react-icons/fa6";
import { IoIosSearch } from "react-icons/io";
import { MdDeleteOutline } from "react-icons/md";

function MyAppointment() {
    return (
        <div>
            <h3 className="text-2xl">Lịch khám của bác sĩ <span className="text-blue-800">Nguyễn Phú Bắc</span></h3>
            <div className="flex gap-7 items-center mt-5">
                <div className="flex items-center border border-gray-400 rounded-md grow overflow-hidden">
                    <input className="grow outline-none px-1" placeholder="Tìm kiếm bệnh nhân theo tên hoặc số điện thoại " />
                    <span className="p-2 bg-blue-700 h-full cursor-pointer"><IoIosSearch size={"1.5rem"} color="white" /></span>
                </div>
                <div>
                    <select className="border border-gray-400 p-2 rounded-md outline-none">
                        <option>Tất cả</option>
                        <option>Chờ xác nhận</option>
                        <option>Xác nhận</option>
                        <option>Đã xong</option>
                        <option>Đã hủy</option>
                    </select>
                </div>
            </div>
            <div className="mt-5">
                <div className="relative flex flex-col w-full h-full text-gray-700 bg-white shadow-md rounded-lg bg-clip-border">
                    <table className="w-full text-left table-auto min-w-max">
                        <thead>
                            <tr className="border-b border-slate-300 bg-slate-50">
                                <th className="p-4 text-sm font-normal leading-none text-slate-500">STT</th>
                                <th className="p-4 text-sm font-normal leading-none text-slate-500">Bệnh nhân</th>
                                <th className="p-4 text-sm font-normal leading-none text-slate-500">Lịch hẹn</th>
                                <th className="p-4 text-sm font-normal leading-none text-slate-500">Trạng thái</th>
                                <th className="p-4 text-sm font-normal leading-none text-slate-500">Chức năng</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="hover:bg-slate-50">
                                <td className="p-4 border-b border-slate-200 py-5">
                                    <p className="block font-semibold text-sm text-slate-800">1</p>
                                </td>
                                <td className="p-4 border-b border-slate-200 py-5">
                                    <p className="block font-semibold text-sm text-slate-800">1</p>
                                </td>
                                <td className="p-4 border-b border-slate-200 py-5">
                                    <p className="block font-semibold text-sm text-slate-800">John</p>
                                </td>
                                <td className="p-4 border-b border-slate-200 py-5">
                                    <p className="text-sm text-slate-500">09787</p>
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
    );
}

export default MyAppointment;