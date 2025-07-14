import { IoMdClose } from "react-icons/io";
import { useNavigate } from "react-router-dom";

function ModalCRUDpackage({ setIsShowModal, type }) {

    const navigate = useNavigate()

    const handleClickClose = () => {
        setIsShowModal(false)
        if (type !== "ADD") {
            navigate(location.pathname)
        }
    }

    return (
        <div className="fixed left-0 right-0 top-0 bottom-0 bg-black/40">
            <div className="w-5xl bg-white min-h-6 rounded-2xl mx-auto mt-10 px-5">
                <div className="flex justify-between py-3 border-b">
                    {type === "ADD" && <p className="text-xl font-semibold">Thêm gói khám</p>}
                    {type === "VIEW" && <p className="text-xl font-semibold">Thông tin gói khám</p>}
                    {type === "UPDATE" && <p className="text-xl font-semibold">Chỉnh sửa thông tin gói khám</p>}
                    <span className="cursor-pointer" onClick={() => handleClickClose()}><IoMdClose size={'1.5rem'} /></span>
                </div>
                <div className="mt-5 pb-5 h-[550px] overflow-y-auto">
                    <div>
                        <label>Tên gói khám<span className="text-red-500">*</span></label>
                        <input className="border border-gray-500 rounded-md p-1"/>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ModalCRUDpackage;