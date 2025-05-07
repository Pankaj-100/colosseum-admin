
import React from 'react'
import Layout from '../layout/Layout'
import { Image } from 'antd'
import useSelection from 'antd/es/table/hooks/useSelection'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

function Profile() {
  const {admin} = useSelector(state=>state.auth);
  
  
  return (
    <Layout>


    <div className='flex justify-center items-center flex-col'>
      {/* <Image className='-mb-9' id='taj' src="https://i.etsystatic.com/36047658/r/il/a3d2af/4013228698/il_fullxfull.4013228698_2qfn.jpg" preview={false} width={120} alt="" /> */}
      <Image
        src={ admin?.image||'https://api.dicebear.com/7.x/miniavs/svg?seed=50'}
        className='border border-gray-400 rounded-[100%]  block '
        alt='Profile Image' 
        preview={false}
        width={200}
      />
    </div>
    <div>
    
      <p className='text-center'>{admin?.name}</p>
      <p className='text-center text-sm text-gray-600'>{admin?.email}</p>
      <p className='text-center text-xs text-gray-600'>+91 9192939495</p>
  
    </div>
    <div className='flex items-center gap-2 justify-end my-2'>
      <Link to={'/profile/edit'} className='px-3 py-1 border border-gray-500 rounded hover:bg-gray-800 hover:text-white'>Edit</Link>
        
    </div>
 
    </Layout>
  )
}

export default Profile