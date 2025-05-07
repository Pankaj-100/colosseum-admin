import React, { useEffect, useState } from 'react';
import Layout from '../../layout/Layout';
import { Image, Select, Skeleton, Space, Table, Tabs, Tag } from 'antd';
import { Link, useParams, useNavigate } from 'react-router-dom'; // Updated import
import { getUserDetails } from '../../store/api';
import { useDispatch, useSelector } from 'react-redux';
import { FiEye } from 'react-icons/fi';

function ViewUser() {
  const [pageSize, setPageSize] = useState(5);
  const { user_id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Initialize navigate
  const { contentlang } = useSelector(state => state.language);

  useEffect(() => {
    getUserDetails(dispatch, user_id);
  }, []);

  const { user, loading } = useSelector(state => state.user);

  const columns2 = [
    {
      title: contentlang['name'],
      dataIndex: 'name',
      key: 'name',
      render: (text) => <a>{text}</a>,
    },
    {
      title: contentlang['phoneNumber'],
      dataIndex: 'Phone_no',
      key: 'Phone_no',
      render: (text) => <a>{text}</a>,
    },
  ];

  const items = [
    {
      key: '1',
      label: contentlang['personal_information'],
      children: (
        <>
          <div className='border border-black rounded-[20px] p-4 mx-auto h-full' id='left'>
            <div className='flex justify-center'>
              <Image
                src={user?.profileImage || 'https://api.dicebear.com/7.x/miniavs/svg?seed=1'}
                className='border border-gray-400 rounded-full block'
                alt='Profile Image'
                preview={false}
                width={200}
                height={200}
              />
            </div>
            <div>
              <p className='text-center'>Name: {user?.name}</p>
              <p className='text-center text-sm text-gray-600'>Email: {user?.email}</p>
              <p className='text-center text-xs text-gray-600'>Contact: {user?.phone}</p>
              <p className='text-center'>Status: {user?.verified ? "Verified" : "Not Verified"}</p>
            </div>
          </div>
        </>
      ),
    },
  ];

  return (
    <Layout>
      <button 
        onClick={() => navigate(-1)} // Navigates back
        className="mb-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
      >
        ← Back
      </button>
      <Tabs items={items} />
    </Layout>
  );
}

export default ViewUser;