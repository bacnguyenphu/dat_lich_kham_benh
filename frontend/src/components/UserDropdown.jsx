import { Link } from "react-router-dom";
import defaultAvatar from '../assets/defaultAvatar.png'
import { CiUser } from "react-icons/ci";
import { IoIosLogOut } from "react-icons/io";
import { RxCountdownTimer } from "react-icons/rx";
import { FaCaretDown } from "react-icons/fa6";
import { useEffect, useRef, useState } from "react";

function UserDropdown({ auth }) {

    // const navigate = useNavigate()
    const modalUser = useRef()
    const [showModal, setShowModal] = useState(false)

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalUser.current && !modalUser.current.contains(event.target)) {
                setShowModal(false); // Ẩn div khi click ra ngoài
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [])

    const navs = [
        {
            title: "Thông tin cá nhân",
            icon: <CiUser size={'1.5rem'} />,
            path: "USER_PROFILE"
        },
        {
            title: "Lịch hẹn",
            icon: <RxCountdownTimer size={'1.5rem'} />,
            path: "USER_PROFILE"
        },
        {
            title: "Đăng xuất",
            icon: <IoIosLogOut size={'1.5rem'} />,
            path: "LOGOUT"
        },
    ]

    return (
        <div ref={modalUser} className="relative">
            <div className='flex justify-end items-center gap-4 cursor-pointer'
                onClick={() => { setShowModal(!showModal) }}
            >
                <div className="size-12 rounded-full overflow-hidden">
                    <img src={(auth?.data?.avatar) ? auth?.data?.avatar : defaultAvatar} className="size-full object-center object-cover" />
                </div>
                <p className='font-semibold'>{auth?.data?.firstName} {auth?.data?.lastName}</p>
                <span><FaCaretDown /></span>
            </div>
            {showModal &&
                <div className="w-[250px] rounded-xl absolute right-0 bg-white shadow-[0px_8px_10px_-2px_rgba(0,_0,_0,_0.4)] z-[100] p-5 text-black mt-2">
                    <div className="flex gap-4 cursor-pointer"

                    >
                        <div className="size-14 border p-1 rounded-full overflow-hidden cursor-pointer">
                            <img
                                className="object-cover object-center size-full rounded-full"
                                alt="Ảnh lỗi" src={auth?.data?.avatar || defaultAvatar}
                                onError={(e) => {
                                    e.target.onerror = null; // Ngăn lặp vô hạn
                                    e.target.src = defaultAvatar; // Đổi sang ảnh mặc định
                                }}
                            />
                        </div>
                        <div className="flex flex-col items-start">
                            <span className="text-lg">{auth?.data?.firstName} {auth?.data?.lastName}</span>
                            <span className="text-sm font-normal">{auth?.data?.phone}</span>
                        </div>
                    </div>

                    <ul className="mt-5">
                        {navs.map((nav, index) => {
                            return (
                                <Link to={nav.path} key={`nav-menu-${index}`}>
                                    <li className="flex mt-3 gap-2 cursor-pointer">
                                        <span>{nav.icon}</span>
                                        <span>{nav.title}</span>
                                    </li>
                                </Link>
                            )
                        })}
                    </ul>
                    {/* {auth && auth.role === 'R2' &&
                        <div className="flex mt-3 gap-2 cursor-pointer items-center"
                            onClick={() => { navigate(ADMIN_MANAGE_POSTS) }}
                        >
                            <span><GrUserAdmin /></span>
                            <span>Quản trị viên</span>
                        </div>
                    } */}
                </div>
            }
        </div>
    );
}

export default UserDropdown;