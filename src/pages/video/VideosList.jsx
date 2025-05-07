import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getVideos } from '../../store/api';
import { Table, Image, Modal, Select, Space, Tag } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { MdDelete, MdModeEdit } from "react-icons/md";
import { FiEye } from "react-icons/fi";
import Layout from '../../layout/Layout';
import SearchBar from '../../component/SearchBar';
import Skeleton from 'react-loading-skeleton';
import Swal from 'sweetalert2';
import axiosInstance from '../../utils/axios';

const VideosList = () => {
  const [pageSize, setPageSize] = useState(5);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [videoId, setVideoId] = useState();
  const { token } = useSelector(state => state.auth);
  const { videos, loading, count } = useSelector(state => state.video);
  const { contentlang } = useSelector(state => state.language);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [video, setVideo] = useState({});
  const { search } = useSelector(state => state.video);

  const columns = [
    {
      title: contentlang['S_n'],
      dataIndex: 'sn',
      key: 'sn',
      width: 50,
      render: (_, __, index) => <h1 className="font-bold ">{index + 1}</h1>,
    },
    {
      title: 'Thumbnail',
      dataIndex: 'thumbnailUrl',
      key: 'thumbnail',
      render: (url) => (
        <Image 
          src={url || 'https://via.placeholder.com/100'}
          width={50}
          height={50}
          className="border border-gray-300 rounded custom-preview"
        />
      ),
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (text) => (
        <div>
          <h1>{text}</h1>
        </div>
      )
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (text) => (
        <div>
          <p className="text-xs text-gray-500">
            {text?.length > 50 ? `${text.substring(0, 50)}...` : text || 'No description'}
          </p>
        </div>
      )
    },
    {
      title: 'Duration',
      key: 'duration',
      render: (_, record) => (
        <div>
          <p className="text-xs text-gray-500">
            {record.duration?.hours > 0 && `${record.duration.hours}h `}
            {record.duration?.minutes > 0 && `${record.duration.minutes}m `}
            {record.duration?.seconds > 0 && `${record.duration.seconds}s`}
          </p>
        </div>
      ),
    },
    {
      title: 'Language',
      dataIndex: 'language',
      key: 'language',
      render: (text) => (
        <div>
          <Tag color="blue">{text || 'Unknown'}</Tag>
        </div>
      )
    },
    {
      title: contentlang['action'],
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Link to={`/videos/${record._id}`}><FiEye/></Link>
          <Link to={`/videos/edit/${record._id}`}><MdModeEdit/></Link>
          <Link className="hover:text-red-600" onClick={() => showModal(record._id)}><MdDelete/></Link>
        </Space>
      ),
    },
  ];

  const showModal = async (id) => {
    setIsModalOpen(true);
    try {
      console.log(id)
      const { data } = await axiosInstance.get(`api/video/${id}`);
      setVideoId(data.video);
        setVideoId(id);
    } catch (error) {
      Swal.fire('Opps!', error?.response?.data);
    }
  };

  const handleOk = async () => {
    setIsModalOpen(false);
    try {
      const { data } = await axiosInstance.delete(`api/video/${videoId}`);
      if (data.success) {
        Swal.fire('Congrats!', 'Video deleted successfully', 'success').then(() => {
          getVideos(dispatch, search, token);
        });
      }
    } catch (error) {
      Swal.fire('Opps!', 'Something went wrong', 'error');
    }
    navigate('/videos');
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    navigate('/videos');
  };

  useEffect(() => {
    getVideos(dispatch, search);
  }, []);

  return (
    <Layout>
      
      <div className="flex justify-between items-center mx-3 mb-4">
  <h1 className="text-xl font-bold text-gray-500">Videos</h1>
  <div className="flex items-center">
    <SearchBar placeholder="Search by title" type={'video'} />
    <Link
      to="/videos/upload"
      className="ml-4 bg-lime-500 text-dark px-4 py-2 rounded-md text-sm font-medium transition-colors"
    >
      Upload Video
    </Link>
  </div>
</div>
      <div className="">
        {loading ? <Skeleton count={13} height={30} /> : 
          <>
            <Table 
              columns={columns} 
              dataSource={videos.map((item, index) => ({ ...item, key: item.id || index }))} 
              rowKey="key" 
              pagination={{pageSize: pageSize, pageSizeOptions: [5,10,15,20], total: count}}
            />
            <Select
              defaultValue={pageSize}
              style={{position: 'relative', top: '-50px'}}
              onChange={(value) => setPageSize(value)}
            >
              <Select.Option value={5}>5</Select.Option>
              <Select.Option value={10}>10</Select.Option>
              <Select.Option value={20}>20</Select.Option>
              <Select.Option value={50}>50</Select.Option>
            </Select>
          </>
        }
      </div>

      <div>
        <Modal title="Delete Video" onOk={handleOk} onCancel={handleCancel} open={isModalOpen}>
          <h1>Are you sure want to delete <span className="font-bold">{video?.title}</span>?</h1>
        </Modal>
      </div>
    </Layout>
  );
};

export default VideosList;