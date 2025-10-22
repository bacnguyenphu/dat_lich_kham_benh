import logo from '../../assets/logo.png'
import { HiOutlineUserCircle } from "react-icons/hi2";
import { ImUser } from "react-icons/im";
import { FaLock } from "react-icons/fa";
import { useState } from 'react';
import { loginDoctor } from '../../services/authService';

function LoginDoctor() {

    const [payload, setPayload] = useState({
        phone: '',
        password: ''
    })

    const handleSetOnchange = (e) => {
        const { name, value } = e.target
        setPayload(prev => {
            return {
                ...prev,
                [name]: value
            }
        })
    }

    const handleClickLogin = async()=>{
        const res = await loginDoctor(payload)

    }

    return (
        <div className="bg-[#D1DFC4] w-full h-screen">
            <div className='flex items-center cursor-pointer lg:w-1/5 pt-5 pl-10'>
                <div className='h-[80px] w-[80px]'>
                    <img className='object-center object-cover size-full scale-125' src={logo} />
                </div>
                <p className='text-2xl font-semibold font-Lobster'>Nger Doctor</p>
            </div>
            <div className='mt-20 flex flex-col items-center'>
                <div className='flex flex-col items-center text-[#1F8ACC]'>
                    <HiOutlineUserCircle size={'5rem'} />
                    <h3 className='text-2xl'>Đăng nhập</h3>
                </div>
                <div className='w-[410px] flex flex-col items-center bg-[#1F8ACC] rounded-lg py-3 gap-5'>
                    <div className="bg-white rounded-md flex items-center justify-between w-9/12">
                        <input className='outline-none rounded-md p-1 grow-1' placeholder='Tên đăng nhập' name='phone'
                            onChange={(e) => { handleSetOnchange(e) }}
                        />
                        <span className='px-2'>
                            <ImUser color='black' size={"1.25rem"} />
                        </span>
                    </div>
                    <div className="bg-white rounded-md flex items-center justify-between w-9/12">
                        <input className='outline-none rounded-md p-1 grow-1' placeholder='Mật khẩu' type='password' name='password'
                            onChange={(e) => { handleSetOnchange(e) }}
                        />
                        <span className='px-2'>
                            <FaLock color='black' size={"1.25rem"} />
                        </span>
                    </div>
                </div>
                <button className='w-[410px] bg-[#1F8ACC] rounded-lg py-1 text-white font-semibold cursor-pointer mt-4'
                onClick={()=>{handleClickLogin()}}
                >
                    Đăng nhập
                </button>
                <p className='italic text-[#1F8ACC] cursor-pointer mt-5'>Bạn quên mật khẩu ?</p>
            </div>
        </div>
    );
}

export default LoginDoctor;