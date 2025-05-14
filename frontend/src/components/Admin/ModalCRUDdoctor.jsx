import { IoMdClose } from "react-icons/io";
import { CiCirclePlus } from "react-icons/ci";
import { useEffect, useState } from "react";
import { getPostions } from "../../services/positionService";
import { getSpecialties } from "../../services/specialtyService";
import DescriptionDetail from "./DescriptionDetail";

function ModalCRUDdoctor() {

    const [postions, setPositions] = useState([])
    const [specialties, setSpecialties] = useState([])
    const [html, setHtml] = useState('')

    useEffect(() => {
        const fetchPostions = async () => {
            const res = await getPostions()
            if (res.err === 0) {
                setPositions(res.data)
            }
        }
        const fetchSpecialties = async () => {
            const res = await getSpecialties()
            if (res.err === 0) {
                setSpecialties(res.data)
            }
        }
        const fetchData = async () => {
            await Promise.all([fetchPostions(), fetchSpecialties()])
        }
        fetchData()
    }, [])


    return (
        <div className="fixed left-0 right-0 top-0 bottom-0 bg-black/40">
            <div className="w-6xl bg-white min-h-6 rounded-2xl mx-auto mt-4 px-5">
                <div className="flex justify-between py-3 border-b">
                    <p className="text-xl font-semibold">Thêm bác sĩ</p>
                    <span className="cursor-pointer"><IoMdClose size={'1.5rem'} /></span>
                </div>
                <div className="mt-5 pb-5 h-[610px] overflow-y-auto">
                    <div className="flex gap-6">
                        <div className="flex flex-col">
                            <label className="">
                                Họ<span className="text-red-500">*</span>
                            </label>
                            <input className="border border-gray-500 rounded-md p-1" />
                        </div>
                        <div className="flex flex-col">
                            <label>Tên<span className="text-red-500">*</span></label>
                            <input className="border border-gray-500 rounded-md p-1" />
                        </div>
                        <div className="flex flex-col">
                            <label>Số điện thoại<span className="text-red-500">*</span></label>
                            <input className="border border-gray-500 rounded-md p-1" />
                        </div>
                        <div className="flex flex-col">
                            <label>Giới tính<span className="text-red-500">*</span></label>
                            <div className="flex items-center gap-5">
                                <div className="flex gap-1">
                                    <input id="male" type="radio" name="gender" value={"Nam"} />
                                    <label className="cursor-pointer" htmlFor="male">Nam</label>
                                </div>
                                <div className="flex gap-1">
                                    <input id="female" type="radio" name="gender" value={"Nữ"} />
                                    <label className="cursor-pointer" htmlFor="female">Nữ</label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-4 flex flex-col ">
                        <label>Địa chỉ<span className="text-red-500">*</span></label>
                        <input className="border border-gray-500 rounded-md p-1 w-3/5" />
                    </div>
                    <div className="flex gap-5">
                        <div className="w-1/2 mt-4 flex flex-col ">
                            <label>Email<span className="text-red-500">*</span></label>
                            <input className="border border-gray-500 rounded-md p-1" disabled />
                        </div>
                        <div className="w-1/2 mt-4 flex flex-col ">
                            <label>Mật khẩu<span className="text-red-500">*</span></label>
                            <input className="border border-gray-500 rounded-md p-1" disabled />
                        </div>
                    </div>
                    <div className="mt-5">
                        <p>Hình ảnh</p>
                        <div className="flex justify-center">
                            <img className="size-24 object-cover object-center rounded-full" src="https://th.bing.com/th/id/OIP.Fh1DHVtoCoFAOCuuv9-NcwHaGT?w=203&h=180&c=7&r=0&o=7&cb=iwp2&dpr=1.3&pid=1.7&rm=3" />

                        </div>
                        <div className="flex justify-center mt-2">
                            <label className="flex items-center text-white gap-3 bg-green-500 rounded-lg px-2 py-1" htmlFor="uploadAvatar">
                                <p className="cursor-pointer">Tải ảnh lên</p>
                                <span><CiCirclePlus size={"1.25rem"} /></span>
                            </label>
                            <input type="file" hidden id="uploadAvatar" />
                        </div>
                    </div>
                    <div className="mt-4 flex flex-col ">
                        <label>Giá khám<span className="text-red-500">*</span></label>
                        <div className="w-2/5 border border-gray-500 rounded-md p-1 flex items-center">
                            <input className="outline-none w-[85%]" />
                            <span className="w-[15%] text-center border-l text-gray-400">VND</span>
                        </div>
                    </div>
                    <div className="mt-8 flex flex-col ">
                        <p className="font-semibold">Chức vụ<span className="text-red-500 font-medium">*</span></p>
                        <div className="grid grid-cols-5 gap-x-6 gap-y-3">
                            {postions.length > 0 &&
                                postions.map(item => {
                                    return (
                                        <div key={`position-checkbox-${item.id}`} className="flex items-center gap-2 ">
                                            <input id={`position-checkbox-${item.id}`} className="cursor-pointer" type="checkbox" value={item.id} />
                                            <label htmlFor={`position-checkbox-${item.id}`} className="cursor-pointer">{item.name}</label>
                                        </div>
                                    )
                                })}
                        </div>
                    </div>
                    <div className="mt-8 flex flex-col ">
                        <p className="font-semibold">Chuyên khoa<span className="text-red-500 font-medium">*</span></p>
                        <div className="grid grid-cols-5 gap-x-6 gap-y-3">
                            {specialties.length > 0 &&
                                specialties.map(item => {
                                    return (
                                        <div key={`position-checkbox-${item.id}`} className="flex items-center gap-2 ">
                                            <input id={`position-checkbox-${item.id}`} className="cursor-pointer" type="checkbox" value={item.id} />
                                            <label htmlFor={`position-checkbox-${item.id}`} className="cursor-pointer">{item.name}</label>
                                        </div>
                                    )
                                })}
                        </div>
                    </div>
                    <div className="mt-8 flex flex-col ">
                        <p className="font-semibold">Giới thiệu</p>
                        <div className="">
                            <textarea className="outline-none border border-gray-400 rounded-md w-1/2 h-72 p-2"></textarea>
                        </div>
                    </div>
                    <div className="mt-8 flex flex-col ">
                        <p className="font-semibold">Mô tả chi tiết<span className="text-red-500 font-medium">*</span></p>
                        <div className="">
                            <DescriptionDetail html={html} setHtml={setHtml} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ModalCRUDdoctor;