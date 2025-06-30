import { useEffect, useState } from "react";
import { LuBadgePlus } from "react-icons/lu";
import { getSpecialties } from "../../services/specialtyService";
import { FaRegEye } from "react-icons/fa";
import { FaRegPenToSquare } from "react-icons/fa6";
import { MdDeleteOutline } from "react-icons/md";
import defaultAvatar from '../../assets/defaultAvatar.png'
import Pagination from "../Pagination";
import { set } from "lodash";

function ManageSpecialty() {

    const [specialties, setSpecialties] = useState([])
    const [totalPages, setTotalPages] = useState(0)
    const [isShowModal, setIsShowModal] = useState(false)
    const limit = 7
    const [page, setPage] = useState(1)

    const fetchSpecialties = async () => {
        const res = await getSpecialties(limit, page)
        console.log(res);
        
        if (res.err === 0) {
            setSpecialties(res?.data)
            setTotalPages(res?.totalPage)
        }
    }
    useEffect(() => {
        fetchSpecialties()
    }, [page])

    const handleClickAdd = () => {

    }

    console.log(specialties);


    return (
        <>
            <div className="mt-10 w-6xl mx-auto shadow-item px-4 py-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Quản lý chuyên khoa</h2>
                    <button className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-lg cursor-pointer flex items-center gap-3">
                        <span onClick={() => { handleClickAdd() }}>Thêm chuyên khoa</span>
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
                                    <th className="p-4 text-sm font-normal leading-none text-slate-500">Chuyên khoa</th>
                                    <th className="p-4 text-sm font-normal leading-none text-slate-500">Chức năng</th>
                                </tr>
                            </thead>
                            <tbody>
                                {specialties.length > 0 && specialties.map((item, index) => {
                                    return (
                                        <tr className="hover:bg-slate-50" key={item.id}>
                                            <td className="p-4 border-b border-slate-200 py-5">
                                                <p className="block font-semibold text-sm text-slate-800">{(page-1)*limit+index+1}</p>
                                            </td>
                                            <td className="p-4 border-b border-slate-200 py-5">
                                                <div className="size-16 rounded-full overflow-hidden">
                                                    <img src={(item?.images) ? item?.images : defaultAvatar} className="size-full object-center object-cover" />
                                                </div>
                                            </td>
                                            <td className="p-4 border-b border-slate-200 py-5">
                                                <p className="block font-semibold text-sm text-slate-800">{item?.name}</p>
                                            </td>
                                            <td className="p-4 py-5">
                                                <div className="flex items-center gap-4">
                                                    <span className="cursor-pointer" ><FaRegEye size={"1.25rem"} color="green" /></span>
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
                <div>
                    <Pagination setPage={setPage} totalPages={+totalPages} />
                </div>
            </div>
        </>

    );
}

export default ManageSpecialty;