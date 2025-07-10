import { useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { IoMdClose } from "react-icons/io";
import { useLocation, useNavigate } from "react-router-dom";
import { createPosition, deletePosition } from "../../services/positionService";
import { Validation } from "../../utils/validation";
import { toast } from "react-toastify";

function ModalCRUDposition({ setIsShowModal, type, fetchPositions }) {

    const navigate = useNavigate()
    const location = useLocation()
    const [isLoading, setIsLoading] = useState(false)
    const [errors, setErrors] = useState({})
    const [payload, setPayload] = useState({
        name: ''
    })

    const query = new URLSearchParams(location.search)
    const id = query.get("id")

    const handleClickClose = () => {
        setIsShowModal(false)
        if (type !== "ADD") {
            navigate(location.pathname)
        }
    }

    const handleClickAdd = async () => {
        if (Validation(payload, setErrors)) {
            const res = await createPosition(payload)
            if (res.err === 0) {
                toast.success(res.message)
                handleClickClose()
                fetchPositions()
                setIsLoading(false)
            }
            else {
                toast.error(res.message)
                setIsLoading(false)
            }
        }
    }

    const handleClickDelete = async() => {
        const res = await deletePosition(id)
        if (res.err == 0) {
            toast.success(res.message)
            setIsShowModal(false)
            navigate(location.pathname)
            fetchPositions()
        }
        else {
            toast.error(res.message)
        }
    }

    return (
        <div className="fixed left-0 right-0 top-0 bottom-0 bg-black/40">
            <div className="w-2xl bg-white min-h-6 rounded-xl mx-auto px-5 mt-16">
                <div className="flex justify-between py-3 border-b">
                    {type === "ADD" && <p className="text-xl font-semibold">Thêm chức vụ</p>}
                    {type === "DELETE" && <p className="text-xl font-semibold">Xóa chức vụ</p>}
                    <span className="cursor-pointer" onClick={() => handleClickClose()}><IoMdClose size={'1.5rem'} /></span>
                </div>
                <div className="p-5 h-32">
                    {type !== "DELETE" && <div className="flex flex-col relative ">
                        <p>Tên chức vụ</p>
                        <input className="border border-gray-500 rounded-md p-1 w-full" onChange={(e) => { setPayload({ ...payload, name: e.target.value }) }} />
                        {errors.name && <small className="text-red-500 absolute -bottom-5">{errors.name}</small>}
                    </div>}
                    {type === "DELETE" &&
                        <div>
                            Bạn có chắc muốn xóa chức vụ này ?
                        </div>
                    }
                </div>
                <div className="flex gap-6 justify-end py-5 pr-5">
                    <button className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full cursor-pointer" onClick={() => handleClickClose()}>Thoát</button>
                    {type === "ADD" && <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full cursor-pointer" onClick={() => { handleClickAdd() }}>
                        {isLoading ? <span className="animate-rotate-center inline-block"><AiOutlineLoading3Quarters /></span> : <span>Thêm</span>}
                    </button>}
                    {type === "DELETE" && <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full cursor-pointer" onClick={() => { handleClickDelete() }}>Xóa</button>}
                </div>
            </div>
        </div>
    );
}

export default ModalCRUDposition;