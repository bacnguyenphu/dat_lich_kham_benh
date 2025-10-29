import { useEffect, useState } from "react";
import { LuBadgePlus } from "react-icons/lu";
import { FaRegPenToSquare } from "react-icons/fa6";
import { MdDeleteOutline } from "react-icons/md";
import defaultAvatar from '../../assets/defaultAvatar.png'
import Pagination from "../Pagination";
import { useLocation, useNavigate } from "react-router-dom";
import { getCategoryPackage } from "../../services/categoryPackageService";
import ModalCRUDcategoriesPackage from "./ModalCRUDcategoriesPackage";

function CategoriesPackage() {
    const [categoriesPackage, setCategoriesPackage] = useState([])
    const [type, setType] = useState('')
    const [isShowModal, setIsShowModal] = useState(false)
    const [totalPages, setTotalPages] = useState(0)
    const limit = 4
    const [page, setPage] = useState(1)

    const location = useLocation()
    const navigate = useNavigate()

    const fetchCategoriesPackage = async () => {
        const res = await getCategoryPackage(limit, page)
        if (res.err === 0) {
            setCategoriesPackage(res?.data)
            setTotalPages(res?.totalPage)
        }
    }
    useEffect(() => {
        fetchCategoriesPackage()
    }, [page])

    const handleClickAdd = () => {
        setIsShowModal(true)
        setType("ADD")
    }
    const handleClickDelete = (id) => {
        setType("DELETE")
        setIsShowModal(true)
        navigate(location.pathname + `?id=${id}`)
    }
    const handleClickUpdate = (id) => {
        setType("UPDATE")
        setIsShowModal(true)
        navigate(location.pathname + `?id=${id}`)
    }

    return (
        <>
            <div className="mt-10 w-6xl mx-auto shadow-item px-4 py-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Quản lý chuyên khoa</h2>
                    <button className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-lg cursor-pointer flex items-center gap-3">
                        <span onClick={() => { handleClickAdd() }}>Thêm danh mục</span>
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
                                    <th className="p-4 text-sm font-normal leading-none text-slate-500">Danh mục</th>
                                    <th className="p-4 text-sm font-normal leading-none text-slate-500">Chức năng</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categoriesPackage.length > 0 && categoriesPackage.map((item, index) => {
                                    return (
                                        <tr className="hover:bg-slate-50" key={item.id}>
                                            <td className="p-4 border-b border-slate-200 py-5">
                                                <p className="block font-semibold text-sm text-slate-800">{(page - 1) * limit + index + 1}</p>
                                            </td>
                                            <td className="p-4 border-b border-slate-200 py-5">
                                                <div className="size-16 rounded-full overflow-hidden">
                                                    <img src={(item?.image) ? item?.image : defaultAvatar} className="size-full object-center object-cover" />
                                                </div>
                                            </td>
                                            <td className="p-4 border-b border-slate-200 py-5">
                                                <p className="block font-semibold text-sm text-slate-800">{item?.name}</p>
                                            </td>
                                            <td className="p-4 py-5">
                                                <div className="flex items-center gap-4">
                                                    <span className="cursor-pointer" onClick={() => { handleClickUpdate(item.id) }}><FaRegPenToSquare size={"1.25rem"} color="#EFB704" /></span>
                                                    <span className="cursor-pointer" onClick={() => { handleClickDelete(item.id) }}><MdDeleteOutline size={"1.5rem"} color="red" /></span>
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
            {isShowModal&&<ModalCRUDcategoriesPackage type={type} setIsShowModal={setIsShowModal} fetchCategoriesPackage={fetchCategoriesPackage}/>}
        </>

    );
}

export default CategoriesPackage;