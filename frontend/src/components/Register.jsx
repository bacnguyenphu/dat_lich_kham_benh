import bg_image from '../assets/bg_login.png'
import { useNavigate } from 'react-router-dom';
import { LOGIN } from '../utils/path';
import { useState } from 'react';
import Swal from 'sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css';
import { register } from '../services/authService';

function Register() {
    const navigate = useNavigate()
    const [data, setData] = useState({
        phone: '',
        password: '',
        passwordConfirm: '',
    })
    const handleRegister = async () => {
        if (data.password !== data.passwordConfirm) {
            Swal.fire({
                title: "Register false!",
                text: "Password does not match",
                icon: "error"
            });
            return
        }

        const res = await register({ phone: data.phone, password: data.password })
        if (res.err === 0) {
            Swal.fire({
                title: res.message,
                icon: "success"
            });
            navigate(LOGIN)
        }
        else {
            Swal.fire({
                title: "Register fasle!",
                text: res.message,
                icon: "error"
            });
        }
    }
    return (
        <div className='h-screen bg-no-repeat bg-center bg-cover relative flex items-center' style={{ backgroundImage: `url(${bg_image})` }}>
            <div className='bg-white w-[90%] lg:w-[400px] h-[500px] rounded-br-3xl rounded-tl-3xl inset-shadow-2xs mx-auto lg:mx-0 lg:ml-40 px-8 flex flex-col'>
                <h2 className='font-semibold text-3xl h-1/5  flex items-center'>Đăng ký</h2>
                <div className='h-3/5 flex flex-col gap-5 '>
                    <div className='flex flex-col gap-1 '>
                        <label>Số điện thoại</label>
                        <input className='border border-primary-50 outline-hidden rounded-xs p-1'
                            onChange={(e) => { setData({ ...data, phone: e.target.value }) }}
                        />
                    </div>
                    <div className='flex flex-col gap-1'>
                        <label>Mật khẩu</label>
                        <input className='border border-primary-50 outline-hidden rounded-xs p-1' type='password'
                            onChange={(e) => { setData({ ...data, password: e.target.value }) }}
                        />
                    </div>
                    <div className='flex flex-col gap-1'>
                        <label>Nhập lại mật khẩu</label>
                        <input className='border border-primary-50 outline-hidden rounded-xs p-1' type='password'
                            onChange={(e) => { setData({ ...data, passwordConfirm: e.target.value }) }}
                        />
                        <div className='flex justify-between'>
                            <p className='italic text-blue-400 cursor-pointer text-[14px] text-right' onClick={() => { navigate(LOGIN) }}>Bạn đã có tài khoản ?</p>
                        </div>
                    </div>
                </div>
                <div className='h-1/5 '>
                    <button className='bg-primary-100 w-full text-white font-semibold text-xl py-2 rounded-2xl cursor-pointer'
                        onClick={() => { handleRegister() }}
                    >
                        Đăng ký
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Register;