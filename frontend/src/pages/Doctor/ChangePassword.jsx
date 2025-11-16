import { useState } from "react";
import { IoMdSave } from "react-icons/io";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import { changePasswordDoctor } from "../../services/authService";

function ChangePassword() {

    const authDoctor = useSelector(state => state?.authDoctor?.data)
    const [oldPassword, setOldPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')

    const handleSubmit = async () => {
        if (!oldPassword.trim() || !newPassword.trim()) {
            Swal.fire({
                title: "Bạn cần nhập đủ dữ liệu !",
                icon: 'warning'
            })
        } else {
            Swal.fire({
                title: "Bạn có muốn đổi mật khẩu ?",
                showDenyButton: true,
                confirmButtonText: "Đổi mật khẩu",
                denyButtonText: "Thoát"
            }).then(async (result) => {
                if (result.isConfirmed) {
                    const res = await changePasswordDoctor({
                        idDoctor: authDoctor.id,
                        oldPassword,
                        newPassword
                    })

                    if(res.err===6){
                        Swal.fire({
                            title:'Mật khẩu không chính xác',
                            icon:'error'
                        })
                    }
                    else if(res.err===0){
                        Swal.fire({
                            title:'Đổi mật khẩu thành công',
                            icon:'success'
                        })
                    }
                    else{
                        Swal.fire({
                            title:'Có lỗi xảy ra không thể đổi mật khẩu!',
                            icon:'error'
                        })
                    }
                    
                }
            });
        }

    }

    return (
        <div>
            <div className="flex gap-5 mt-10">
                <div className="w-1/2">
                    <label><span className="text-red-500">*</span> Họ</label>
                    <input disabled value={authDoctor?.firstName} className="w-full rounded-md p-1 outline-none border border-gray-400 mt-1 bg-gray-100 cursor-not-allowed" />
                </div>
                <div className="w-1/2">
                    <label><span className="text-red-500">*</span> Tên</label>
                    <input disabled value={authDoctor?.lastName} className="w-full rounded-md p-1 outline-none border border-gray-400 mt-1 bg-gray-100 cursor-not-allowed" />
                </div>
            </div>
            <div className="mt-10">
                <label><span className="text-red-500">*</span> Email</label>
                <input disabled value={authDoctor?.email} className="w-full rounded-md p-1 outline-none border border-gray-400 mt-1 bg-gray-100 cursor-not-allowed" />
            </div>
            <div className="flex gap-5 mt-10">
                <div className="w-1/2">
                    <label><span className="text-red-500">*</span> Nhập mật khẩu cũ</label>
                    <input type="password" className="w-full rounded-md p-1 outline-none border border-gray-400 mt-1" value={oldPassword}
                        onChange={(e) => { setOldPassword(e.target.value) }}
                    />
                </div>
                <div className="w-1/2">
                    <label><span className="text-red-500">*</span> Nhập mật khẩu mới</label>
                    <input type="password" className="w-full rounded-md p-1 outline-none border border-gray-400 mt-1" value={newPassword}
                        onChange={(e) => { setNewPassword(e.target.value) }}
                    />
                </div>
            </div>
            <button className="mt-10 w-full bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-lg cursor-pointer flex items-center justify-center gap-3"
                onClick={() => { handleSubmit() }}
            >
                <span><IoMdSave /></span>
                <span className="font-semibold">Đổi thông tin</span>
            </button>
        </div>
    );
}

export default ChangePassword;