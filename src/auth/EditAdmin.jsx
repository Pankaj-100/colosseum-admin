import React, { useEffect, useState } from 'react'
import Layout from '../layout/Layout'
import { Image, Input, Modal } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import axiosInstance from '../utils/axios';
import { setUser, updateProfile } from '../store/authSlice';

function EditAdmin() {
    const [isModalOpen, setIsModalOpen] = useState(true);
    const [loading,setLoading] = useState(false)
    const {admin} = useSelector(state=>state.auth)
    
    
   

    const dispatch = useDispatch()
    const navigate = useNavigate()
const [form,setForm] = useState({
  name:'',
  contact:'',
  address:'',
  email:'',
  status:true,
  image:''

})
  const showModal = () => {
    setIsModalOpen(true);
    
  };
  const updateAdmin = async ()=>{
    try {
        const {data} = await axiosInstance.put(`/admin/update_admin_profile/${admin?.id}`,form)
        // if(data.success) {
        //     dispatch(updateProfile(data))
        // }
        console.log(data,'update admin');
        dispatch(setUser(data))
      
    } catch (error) {
        Swal.fire('Opss!','Something went wrong','error')
    }
  }
  const handleOk = () => {
    setIsModalOpen(false);
   navigate('/profile')
   updateAdmin()
  };
  const handleCancel = () => {
    setIsModalOpen(false);
   navigate('/profile')
    
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    console.log(form,'form');
  };
  const handleFileChange = async (e)=>{
    try {
        const file = e.target.files[0];
         if(file) {
             const formdata =  new FormData()
             formdata.append('images',file)
             const {data} = await axiosInstance.post('/upload-image', formdata)
             setForm((prev) => ({ ...prev, image: data.url[0] }));
         }
         
    } catch (error) {
        console.log(error,'error uploadinf file ');
         Swal.fire('Opps!','Something went wrong','error')
    }
  }
  useEffect(()=>{
    if(admin){
      setForm(
       {
         name : admin.name || '',
         contact:admin.contact || '',
         email:admin.email || '',
         image:admin.image || ''
       }
      )
    }
        },[])
  return (
   <Layout>

<Modal title={ loading ? `Loading... `:`Edit ${admin?.name}`} open={isModalOpen} onOk={handleOk} onCancel={handleCancel} >
        <div className='flex justify-center flex-col items-center gap-2 rounded'>
      {form['image'] ? <Image src={form['image']}/> :      <Image preview={false} className='rounded' height={200} src={admin?.image} alt='profile'/>}
             <input type='file' className='border border-gray-400 px-2 py-1 rounded' name='image' onChange={handleFileChange}/>
        </div>
        
        <div>
            <label htmlFor=""> Name:</label>
            <Input type='text' name='name'  placeholder='Product Name' value={form['name']} onChange={handleInputChange}/>
           Phone no.:
            <Input type='number' placeholder='Phone number' name='contact' value={form['contact']} onChange={handleInputChange}/>
            Email:
            <Input type='text'  placeholder='Enter email' name='email' value={form['email']} onChange={handleInputChange}/>

            
       </div>
      </Modal>
   </Layout>
  )
}

export default EditAdmin