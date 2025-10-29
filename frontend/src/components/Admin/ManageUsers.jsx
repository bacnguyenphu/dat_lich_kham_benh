import { useEffect, useState } from 'react';
import defaultAvatar from '../../assets/defaultAvatar.png'
import { FaRegPenToSquare } from "react-icons/fa6";
import { LuBadgePlus } from "react-icons/lu";
import { MdDeleteOutline } from "react-icons/md";
import ModalCRUDuser from './ModalCRUDuser';
import { getUsers } from '../../services/userService';
import Pagination from '../Pagination';
import { useNavigate } from 'react-router-dom';

function ManageUsers() {

    const navigate = useNavigate()

    const [isShowModal, setIsShowModal] = useState(false)
    const [type, setType] = useState('')

    const [users, setUsers] = useState([])

    const [totalPages, setTotalPages] = useState(0)
    const limit = 4
    const [page, setPage] = useState(1)

    const handleClickAdd = () => {
        setType("ADD")
        setIsShowModal(true)
    }
    const handleClickUpdate = (idUser) => {
        setType("UPDATE")
        setIsShowModal(true)
        navigate(location.pathname + `?id=${idUser}`)
    }
    const handleClickDelete = (idUser) => {
        setType("DELETE")
        setIsShowModal(true)
        navigate(location.pathname + `?id=${idUser}`)
    }

    const fetchUsers = async () => {
        const res = await getUsers(limit,page)
        if (res.err === 0) {
            setUsers(res.data)
            setTotalPages(res?.totalPage)
        }
    }

    useEffect(() => {
        fetchUsers()
    }, [page])

    return (
        <>
            <div className="mt-10 w-6xl mx-auto shadow-item px-4 py-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Danh sách người dùng</h2>
                    <button className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-lg cursor-pointer flex items-center gap-3"
                        onClick={()=>{handleClickAdd()}}
                    >
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
                                    <th className="p-4 text-sm font-normal leading-none text-slate-500">Tên</th>
                                    <th className="p-4 text-sm font-normal leading-none text-slate-500">Số điện thoại</th>
                                    <th className="p-4 text-sm font-normal leading-none text-slate-500">Email</th>
                                    <th className="p-4 text-sm font-normal leading-none text-slate-500">Chức năng</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.length > 0 && users.map((user,index) => {
                                    return (
                                        <tr className="hover:bg-slate-50" key={user.id}>
                                            <td className="p-4 border-b border-slate-200 py-5">
                                                <p className="block font-semibold text-sm text-slate-800">{(page - 1) * limit + index + 1}</p>
                                            </td>
                                            <td className="p-4 border-b border-slate-200 py-5">
                                                <div className="size-16 rounded-full overflow-hidden">
                                                    <img src={(user?.avatar) ? user?.avatar : defaultAvatar} className="size-full object-center object-cover" />
                                                </div>
                                            </td>
                                            <td className="p-4 border-b border-slate-200 py-5">
                                                <p className="block font-semibold text-sm text-slate-800">{user?.firstName} {user?.lastName}</p>
                                            </td>
                                            <td className="p-4 border-b border-slate-200 py-5">
                                                <p className="text-sm text-slate-500">{user?.phone}</p>
                                            </td>
                                            <td className="p-4 border-b border-slate-200 py-5">
                                                <p className="text-sm text-slate-500">{user?.email}</p>
                                            </td>
                                            <td className="p-4 py-5">
                                                <div className="flex items-center gap-4">
                                                    <span className="cursor-pointer" onClick={() => { handleClickUpdate(user.id) }}><FaRegPenToSquare size={"1.25rem"} color="#EFB704" /></span>
                                                    <span className="cursor-pointer" onClick={() => { handleClickDelete(user.id) }}><MdDeleteOutline size={"1.5rem"} color="red" /></span>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
                {users.length > 0 &&
                    <div>
                        <Pagination setPage={setPage} totalPages={totalPages} />
                    </div>
                }
            </div>
            {isShowModal && <ModalCRUDuser type={type} setIsShowModal={setIsShowModal} fetchUsers={fetchUsers} />}
        </>

    );
}

export default ManageUsers;