import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png'
import { LOGIN, REGISTER } from '../utils/path';
import { navs } from '../utils/navs';

function Header() {

    const navigate = useNavigate()

    return (
        <div className="h-[80px] px-40 bg-[#EAFBFB] flex items-center">
            <div className='flex items-center cursor-pointer w-1/5'>
                <div className='h-[80px] w-[80px]'>
                    <img className='object-center object-cover size-full scale-125' src={logo} />
                </div>
                <p className='text-2xl font-semibold font-Lobster'>Nger Hospital</p>
            </div>
            <div className='flex gap-7 w-3/5'>
                {navs.map((nav, i) => {
                    return (
                        <div key={`nav-${i}`} className='cursor-pointer'>
                            <p className='font-semibold'>{nav.name}</p>
                            <p className='text-xs text-nowrap'>{nav.title}</p>
                        </div>
                    )
                })}
            </div>
            <div className=' w-1/5 text-white flex gap-4'>
                <button className='rounded-lg bg-primary-50 px-2 py-1 cursor-pointer'
                    onClick={() => { navigate(LOGIN) }}
                >Đăng nhập</button>

                <button className='rounded-lg bg-primary-50 px-2 py-1 cursor-pointer'
                    onClick={() => { navigate(REGISTER) }}
                >Đăng ký</button>
            </div>

        </div>
    );
}

export default Header;