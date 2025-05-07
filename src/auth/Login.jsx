import { Input } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login } from '../store/api'
import { useDispatch, useSelector } from 'react-redux'
import Spinner from '../component/Spinner'

function Login() {
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('')
  const dispatch = useDispatch()
  const error = useSelector(state=>state.auth.error);
  const errorMessage = useSelector(state=>state.auth.errorMessage);
  const loading = useSelector(state=>state.auth.loading);
  const admin = useSelector(state=>state.auth.admin)
  const user = localStorage.getItem('admin')
  const navigate = useNavigate()

  useEffect(()=>{
    if(user){
      navigate('/dashboard')
   }
  },[admin])
  return (
    
        <div className='  mx-auto my-20 flex justify-center items-center flex-col gap-2  '>
          {loading && <h1 className='text-3xl text-gray-800'>Loading...</h1>}
          {error && <p className='text-sm text-red-500 border border-red-600 px-2 py-1 bg-red-100 rounded'>{errorMessage}  </p>}
          {admin && <p className='text-sm text-green-500 border border-green-600 px-2 py-1 bg-green-100 rounded'>Logged In successfully  </p>}

 <h1 className='text-gray-800 text-xl font-bold text-center'>Login</h1>
 <div className=' flex  gap-2 flex-col mb-3 border border-gray-400 p-10 rounded'>
   
   <Input placeholder='Enter email' onChange={(e)=>setEmail(e.target.value)} type='text'/>
   <Input placeholder='Enter password' onChange={(e)=>setPassword(e.target.value)} type='text'/>
   <div className='flex justify-between'>
   
   <button onClick={()=>login(dispatch,{email,password})} className='border border-gray-300 center rounded w-16 hover:bg-gray-700 hover:text-white'>{loading ? <Spinner size={20}/>: 'Login'}</button>
   <Link className='text-xs hover:text-blue-400'>forget password</Link>
   </div>
   
 </div>
        </div>
    
  )
}

export default Login