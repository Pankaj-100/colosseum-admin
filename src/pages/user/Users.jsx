import React, { useEffect, useState } from "react";
import Layout from "../../layout/Layout";
import UserCard from "../../component/card/UserCard";
import SearchBar from "../../component/SearchBar";
import { Image, Modal, Select, Space, Table, Tag } from "antd";
import { Link, useNavigate, useParams } from "react-router-dom";
import { MdDelete, MdModeEdit } from "react-icons/md";
import { FiEye } from "react-icons/fi";
import { getUserDetails, getUsers } from "../../store/api";
import { useDispatch, useSelector } from "react-redux";
import Skeleton from "react-loading-skeleton";
import Swal from "sweetalert2";
import axiosInstance from "../../utils/axios";
function Users() {
  const [pageSize, setPageSize] = useState(5);
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [userId,setUserId] = useState()
 const {token} = useSelector(state=>state.auth)
  const {users,loading,count} = useSelector(state=>state.user)
 const {contentlang} = useSelector(state=>state.language)
  const columns = [
    {
      title: contentlang['S_n'],
      dataIndex: 'sn',
      key: 'sn',
      width: 50,
      render: (_, __, index) => <h1 className="font-bold ">{index + 1}</h1>,
      
    },
    {
      title: contentlang['profile'],
      dataIndex: 'image',
      key: 'image',
      
      render: (_,text) => <Image width={50} height={50}  className="border border-gray-300 rounded-full custom-preview" src={ text?.profileImage || 'https://cdn-icons-png.flaticon.com/512/5556/5556499.png'}/>,
    },
    {
      title: contentlang['name'],
      dataIndex: 'name',
      key: 'name',
      render: (_,text) => (
        <div>
          <h1>{text?.name}</h1>
        
          <p className="text-xs text-gray-500">{text?.email}</p>
        </div>
      )
    },
    
    {
        title: 'Contact',
        dataIndex: 'contact',
        key: 'contact',
        render: (_,text) => (
          <div>
            <p className="text-xs text-gray-500">{text?.phone}</p>
          </div>
        )
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        render: (_,text) => (
          <div>
          
            <p className='text-xs text-gray-500'>{text?.verified ? "Verified" : "Not Verified"}</p>
          </div>
        )
      },
    {
      title: contentlang['action'],
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Link to={`/users/${record._id}`}><FiEye/></Link>
         <Link to={`/user/edit/${record._id}`}><MdModeEdit/></Link>
         <Link  className="hover:text-red-600" onClick={()=>showModal(record._id)}><MdDelete/></Link>
        </Space>
      ),
    },
  ];
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user,setUser] = useState({})
  const {search} = useSelector(state=>state.user)
  const showModal = async(user_id) => {
    setIsModalOpen(true);
    
    try {
       const {data} = await axiosInstance.get(`api/admin/user_details/${user_id}`)
       setUser(data.user)
    } catch (error) {
       Swal.fire('Opps!',error?.response?.data)
    }

  };
  const handleOk =async () => {
    setIsModalOpen(false);
    try {
      const {data} = await axiosInstance.delete(`api/admin/delete_user/${user?._id}`);
     if(data.success) Swal.fire('Congrats!','User deleted successfully','success').then(()=>{
      getUsers(dispatch,search,token)
     })
    } catch (error) {
      console.log(error,'err');
      Swal.fire('Opps!','Something went wrong','error')
    }
    navigate('/users')
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    navigate('/users')
  };

 useEffect(()=>{
  // getUserDetails(dispatch,userId)
 },[user])
   useEffect(()=>{
    getUsers(dispatch,search)
   },[])
  return (
    <Layout>
   <div className="flex justify-between items-center mx-3 mb-1">
    {/* <select name="" id=""  className="rounded text-sm text-gray-500">
      <option value="latestUser" className=""> Latest User</option>
      <option value="oldUser"> Old User</option>
    </select> */}
    <h1 className="text-xl font-bold text-gray-500">{contentlang['users']}</h1>
   <SearchBar placeholder='Search by name ' type={'user'}/>
   </div>
  
      <div className="">
        {loading ? <Skeleton count={13} height={30}/> :  <>
      <Table columns={columns} dataSource={users.map((item, index) => ({ ...item, key: item.id || index }))}  rowKey="key"  pagination={{pageSize:pageSize,pageSizeOptions:[5,10,15,20],total: count}}/>
      <Select
        defaultValue={pageSize}
     style={{position:'relative',top:'-50px'}}
        onChange={(value) => setPageSize(value)}
      >
        <Select.Option value={5}>5</Select.Option>
        <Select.Option value={10}>10</Select.Option>
        <Select.Option value={20}>20</Select.Option>
        <Select.Option value={50}>50</Select.Option>
      </Select></> }
      </div>
      <div>
        <Modal title={`Delete user`} onOk={handleOk} onCancel={handleCancel} open={isModalOpen}>
   <h1>Are you sure want to delete <span className="font-bold">{user?.name}</span> ?</h1>
        </Modal>
      </div>
    </Layout>
  );
}

export default Users;
