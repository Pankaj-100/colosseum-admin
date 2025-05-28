import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CgProfile } from "react-icons/cg";
import { MdOutlineDashboard } from "react-icons/md";
import { IoSettingsOutline } from "react-icons/io5";
import { IoCartOutline } from "react-icons/io5";
import { MdOutlineMiscellaneousServices } from "react-icons/md";
import { LiaTruckPickupSolid } from "react-icons/lia";
import { HiOutlineCurrencyEuro } from "react-icons/hi2";
import { useDispatch, useSelector } from 'react-redux';
import { Image } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { Dropdown, Space } from 'antd';
import { changeLang } from '../store/languageSlice';
import { logOut } from '../store/authSlice';
import Swal from 'sweetalert2';
import { AiOutlineProduct } from "react-icons/ai";
import { TfiShoppingCart } from "react-icons/tfi";
import { SiGnuprivacyguard } from "react-icons/si";
import { BsFileEarmarkRuled } from "react-icons/bs";
import { BsCameraVideo,BsGeoAltFill ,BsLockFill} from "react-icons/bs";
const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
 
  const {contentlang,language} = useSelector(state=>state.language)
   
 const {admin} = useSelector(state=>state.auth)
 const dispatch =  useDispatch()
 
const location = useLocation()
  console.log(location?.pathname,'location');
  const [nav,setNav] = useState(location?.pathname)
const [lang,setLang] = useState(language)

 async function langChange() {
   if (lang === 'en') setLang('sp')
    else setLang('en')
   dispatch(changeLang(lang)) 
 }
 const navigate = useNavigate()
 const logout =()=>{
  try {
      dispatch(logOut())
      navigate('/')
  } catch (error) {
    Swal.fire('Opps!','Something went wrong','error')
  }
}
 const items = [
  {
    label: (
     
     <p>  Signed In as <span className='text-md text-gray-500 font-bold'>{admin?.name}</span></p>
     
    ),
    key: '0',
  },
  {
    type: 'divider',
  },
  {
    label: (
    <Link to={'/profile'} className='text-gray-600'>{contentlang['profile']}</Link>
       

    ),
    key: '1',
  },
 
  {
    label: ( <Link onClick={logout}>{contentlang['logout']}</Link>),
    key: '3',
    
  },
  
];
  
  return (
    <div className="flex h-screen">
      {/* Sidebar (responsive) */}
      <div
        className={`fixed z-30 inset-y-0 left-0 w-64 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300 ease-in-out bg-gray-800 text-white p-4`}
      >
        <h2 className="text-xl font-bold mb-6"> Colosseum ADMIN</h2>
        <ul>
          
          <Link to={'/dashboard'}><li className={  `flex items-center mb-4 hover:bg-gray-600 p-2 rounded cursor-pointer ${nav.includes('/dashboard') && 'bg-gray-500' } `  }> <MdOutlineDashboard size={20} className="mr-2" /> <span>{contentlang['dashboard']} </span></li></Link>
         
          <Link to={'/users'}><li className={`flex items-center mb-4 hover:bg-gray-600 p-2 rounded cursor-pointer ${nav.includes('/users') && 'bg-gray-500' }`}>
          <CgProfile color='' size={20} className="mr-2" />
          <span>{contentlang['users']}</span>
             </li></Link>
    
<Link to={'/videos'}><li className={`flex items-center mb-4 hover:bg-gray-600 p-2 rounded cursor-pointer ${nav.includes('/videos') && 'bg-gray-500'}`}>
  <BsCameraVideo size={20} className="mr-2" />
  <span>Videos</span>
</li></Link>

<Link to={'/codes'}><li className={`flex items-center mb-4 hover:bg-gray-600 p-2 rounded cursor-pointer ${nav.includes('/codes') && 'bg-gray-500'}`}>
  <BsLockFill size={20} className="mr-2" />
  <span>Code</span>
</li></Link>
<Link to={'/location'}><li className={`flex items-center mb-4 hover:bg-gray-600 p-2 rounded cursor-pointer ${nav.includes('/location') && 'bg-gray-500'}`}>
  <BsGeoAltFill size={20} className="mr-2" />
  <span>Location</span>
</li></Link>

<Link to={'/term'}><li className={`flex items-center mb-4 hover:bg-gray-600 p-2 rounded cursor-pointer ${nav.includes('/term') && 'bg-gray-500'}`}>
  <BsGeoAltFill size={20} className="mr-2" />
  <span>Terms&Condition</span>
</li></Link>


  
        </ul>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header (with toggle for mobile) */} 
        <header className="bg-gray-800 p-4 shadow-md flex items-center justify-between">
          <button
            className="text-gray-200 "
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
      
       <div className='flex justify-end items-center'>
        {/* <h1 className='border border-gry-300 text-white px-2 py-0 mr-3 rounded cursor-pointer' onClick={langChange}>{lang == 'en' ? 'English':'Spanish'}</h1> */}
          {/* <h1 className='text-white mr-3'>{user.name}</h1> */}
          <Link to={'/profile'}>
          
          </Link>
          <Dropdown
    menu={{
      items,
    }}
  >
    <a onClick={(e) => e.preventDefault()}>
      <Space>
      <Image className='border border-gray-300 rounded-full cursor-pointer ' width={30} src={ admin?.image ||'https://api.dicebear.com/7.x/miniavs/svg?seed=8'} preview={false}/>
       
        {/* <DownOutlined className='text-white' /> */}
      </Space>
    </a>
  </Dropdown>
        </div>
      
        </header>

        {/* Main content area */}
        <main className="flex-1 p-8 bg-gray-100 lg:ml-64 md:ml-64 ">
          {children}
        </main>
      </div>

      {/* Overlay for mobile when sidebar is open */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-20 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default Layout;
