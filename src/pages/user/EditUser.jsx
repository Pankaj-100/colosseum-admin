import React, { useEffect, useState } from 'react'
import Layout from '../../layout/Layout'
import { Image, Modal } from 'antd';
import Input from 'antd/es/input/Input';
import axiosInstance from '../../utils/axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getUserDetails } from '../../store/api';
import Swal from 'sweetalert2';

function EditUser() {
    const [loading,setLoading] = useState(false)
    const {user} = useSelector(state=>state.user)
    const [form,setForm] = useState({
        name:'',
        phone:'',
        email:'',
     
    })

    const {user_id} = useParams();
    const dispatch = useDispatch()
    const navigate = useNavigate()
    
    useEffect(()=>{
        getUserDetails(dispatch,user_id)
    },[])
    
    useEffect(()=>{
        if(user){
            setForm({
                name: user.name || '',
                phone: user.phone || '',
                email: user.email || '',
              
            })
        }
    },[user])

    async function editUser(){
        try {
            setLoading(true)
            const {data} = await axiosInstance.put(`api/admin/update_user/${user_id}`,form)
            if(data.success) {
                Swal.fire('Success!', 'User updated successfully', 'success')
            }
        } catch (error) {
            Swal.fire('Opps!','Something went wrong','error')
        } finally {
            setLoading(false)
        }
    }
      
    const [isModalOpen, setIsModalOpen] = useState(true);
    const handleOk = () => {
        editUser().then(() => {
            setIsModalOpen(false);
            navigate('/users')
        })
    };
    
    const handleCancel = () => {
        setIsModalOpen(false);
        navigate('/users')
    };
    
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    return (
        <Layout>
            <Modal 
                title={loading ? `Loading...` : `Edit ${user?.name}`} 
                open={isModalOpen} 
                onOk={handleOk} 
                onCancel={handleCancel}
                confirmLoading={loading}
            >
                <div className='flex justify-center rounded'>
                    <Image 
                        preview={false} 
                        className='rounded' 
                        height={200} 
                        src={user?.profileImage || 'https://api.dicebear.com/7.x/miniavs/svg?seed=1'} 
                        alt='profile'
                    />
                </div>
                
                <div className='space-y-3 mt-4'>
                    <div>
                        <label>User Name:</label>
                        <Input 
                            type='text' 
                            name='name'  
                            placeholder='User Name' 
                            value={form.name} 
                            onChange={handleInputChange}
                        />
                    </div>
                    
                    <div>
                        <label>Phone Number:</label>
                        <Input 
                            type='string' 
                            placeholder='Phone Number' 
                            name='phone' 
                            value={form.phone} 
                            onChange={handleInputChange}
                        />
                    </div>
                    
                    <div>
                        <label>Email:</label>
                        <Input 
                            type='text'  
                            placeholder='Email' 
                            name='email' 
                            value={form.email} 
                            onChange={handleInputChange}
                        />
                    </div>
               
                </div>
            </Modal>
        </Layout>
    )
}

export default EditUser