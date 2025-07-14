import { useState } from "react"
import { LuBadgePlus } from "react-icons/lu"
import ModalCRUDpackage from "./ModalCRUDpackage"

function InformationPackage() {

    const [isShowModal, setIsShowModal] = useState(false)
    const [packages, setPackages] = useState([])
    const [type, setType] = useState('')
    const [totalPages, setTotalPages] = useState(0)
    const limit = 7
    const [page, setPage] = useState(1)

    const handleClickAdd = ()=>{
        setIsShowModal(true)
        setType("ADD")
    }

    return (
        <>
            <div className="mt-10 w-6xl mx-auto shadow-item px-4 py-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Thông tin các gói khám</h2>
                    <button className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-lg cursor-pointer flex items-center gap-3">
                        <span onClick={() => { handleClickAdd() }}>Thêm gói khám</span>
                        <span><LuBadgePlus size={"1.25rem"} /></span>
                    </button>
                </div>
            </div>
            {isShowModal&&<ModalCRUDpackage setIsShowModal={setIsShowModal} type={type}/>}
        </>
    );
}

export default InformationPackage;