import bg_image from '../assets/bg_login.png'
import { useNavigate } from 'react-router-dom';
import { REGISTER } from '../utils/path';
import { useState } from 'react';
import Swal from 'sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css';
import { FaAngleLeft } from "react-icons/fa6";
import { useDispatch } from 'react-redux';
import { loginUser } from '../redux/authSlice';

function Login() {
    // const { data, token, loading, error } = useSelector(state => state.auth)
    const dispatch = useDispatch()

    const navigate = useNavigate()
    const [payload, setPayload] = useState({
        phone: '',
        password: ''
    })

    const handleLogin = async () => {
        if (payload.phone === '' || payload.password === '') {
            Swal.fire({
                title: "Đăng nhập thất bại",
                text: "Bạn phải nhập đủ dữ liệu",
                icon: "warning"
            });
            return
        }

        const res = await dispatch(loginUser(payload))

        if (res.payload?.error === 0) {
            Swal.fire({
                title: res.payload?.message,
                icon: "success"
            }).then(() => {
                navigate('/');
            });
        }
        else {
            Swal.fire({
                title: "Log in fasle!",
                text: res.payload?.message,
                icon: "error"
            });
        }

    }
    return (
        <div className='h-screen bg-no-repeat bg-center bg-cover relative flex items-center w-full' style={{ backgroundImage: `url(${bg_image})` }}>
            <div className='bg-white w-[90%] lg:w-[400px] h-[500px] rounded-br-3xl rounded-tl-3xl inset-shadow-2xs mx-auto lg:mx-0 lg:ml-40 px-8 flex flex-col'>
                <h2 className='font-semibold text-3xl h-1/5  flex items-center'>Đăng nhập</h2>
                <div className='h-3/5 flex flex-col gap-5 '>
                    <div className='flex flex-col gap-1 '>
                        <label>Số điện thoại</label>
                        <input className='border border-primary-50 outline-hidden rounded-xs p-1'
                            onChange={(e) => { setPayload({ ...payload, phone: e.target.value }) }}
                        />
                    </div>
                    <div className='flex flex-col gap-1'>
                        <label>Mật khẩu</label>
                        <input className='border border-primary-50 outline-hidden rounded-xs p-1' type='password'
                            onChange={(e) => { setPayload({ ...payload, password: e.target.value }) }}
                        />
                        <div className='lg:flex justify-between block'>
                            <p className='italic text-blue-400 cursor-pointer text-[14px]'>Quên mật khẩu</p>
                            <p className='italic text-blue-400 cursor-pointer text-[14px]'
                                onClick={() => {
                                    navigate(REGISTER)
                                }}
                            >
                                Bạn chưa có tài khoản ?
                            </p>
                        </div>
                    </div>
                </div>
                <div className='h-1/5 '>
                    <button className='bg-primary-100 w-full text-white font-semibold text-xl py-2 rounded-2xl cursor-pointer'
                        onClick={() => { handleLogin() }}
                    >Đăng nhập</button>
                    <p className='flex items-center justify-start gap-2 cursor-pointer mt-7'
                        onClick={() => { navigate('/') }}
                    >
                        <span>
                            <FaAngleLeft />
                        </span>
                        <span>Về trang chủ</span>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;