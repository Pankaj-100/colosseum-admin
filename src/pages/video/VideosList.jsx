import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getVideos } from '../../store/api';
import { Table, Image, Modal, Select, Space, Tag, Input } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { MdDelete, MdModeEdit } from "react-icons/md";
import { FiEye } from "react-icons/fi";
import Layout from '../../layout/Layout';
import SearchBar from '../../component/SearchBar';
import Skeleton from 'react-loading-skeleton';
import Swal from 'sweetalert2';
import axios from "axios";
import axiosInstance from '../../utils/axios';

const VideosList = () => {
  const [locations, setLocations] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [searchName, setSearchName] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [filteredVideos, setFilteredVideos] = useState([]);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const { data } = await axios.get('https://www.colosseumworld.com/api/location'); 
        setLocations(data?.locations || []); 
      } catch (error) {
        console.error("Failed to fetch locations:", error);
        setLocations([]);
      }
    };

    fetchLocations();
  }, []);

const getLocationNameById = (locationValue) => {
  if (!locationValue) return 'Unknown Location';
  
  const locationId = typeof locationValue === 'object' ? locationValue._id : locationValue;
  const location = locations.find(loc => loc._id === locationId);
  
  return location?.name || 'Unknown Location';
};
  const [pageSize, setPageSize] = useState(5);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [videoId, setVideoId] = useState();
  const { token } = useSelector(state => state.auth);
  const { videos = [], loading, count } = useSelector(state => state.video);
  const { contentlang } = useSelector(state => state.language);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [video, setVideo] = useState({});
  const { search } = useSelector(state => state.video);

  // Apply filters whenever searchName, selectedLanguage, selectedLocation or videos change
  useEffect(() => {
    let result = Array.isArray(videos) ? [...videos] : [];
    
    if (searchName) {
      result = result.filter(video => 
        video?.title?.toLowerCase().includes(searchName.toLowerCase())
      );
    }
    
    if (selectedLanguage) {
      result = result.filter(video => video?.language === selectedLanguage);
    }
    
  if (selectedLocation) {
  result = result.filter(video => {
    const locationId = typeof video.primaryLocation === 'object' ? video.primaryLocation._id : video.primaryLocation;
    return locationId === selectedLocation;
  });
}

    
    setFilteredVideos(result);
  }, [searchName, selectedLanguage, selectedLocation, videos]);

  const columns = [
    {
      title: contentlang['S_n'] || 'S/N',
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
          <h1>{text || 'No title'}</h1>
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
      title: 'Primary Location',
      dataIndex: 'primaryLocation',
      key: 'primaryLocation',
      render: (locationId) => (
        <div>
          <p className="text-xs text-gray-500">
            {getLocationNameById(locationId)}
          </p>
        </div>
      )
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
      title: contentlang['action'] || 'Action',
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
      const { data } = await axiosInstance.get(`api/video/${id}`);
      setVideo(data?.video || {});
      setVideoId(id);
    } catch (error) {
      Swal.fire('Opps!', error?.response?.data?.message || 'Failed to load video');
    }
  };

  const handleOk = async () => {
    setIsModalOpen(false);
    try {
      const { data } = await axiosInstance.delete(`api/video/${videoId}`);
      if (data?.success) {
        Swal.fire('Congrats!', 'Video deleted successfully', 'success').then(() => {
          getVideos(dispatch, search, token);
        });
      }
    } catch (error) {
      Swal.fire('Opps!', error?.response?.data?.message || 'Something went wrong', 'error');
    }
    navigate('/videos');
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    getVideos(dispatch, search);
  }, [dispatch, search]);

  return (
    <Layout>
      <div className="flex justify-between items-center mx-3 mb-4">
        <h1 className="text-xl font-bold text-gray-500">Videos</h1>
        <div className="flex items-center">
          <Link
            to="/videos/upload"
            className="ml-4 bg-lime-500 text-dark px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            Upload Video
          </Link>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="mx-3 mb-4 p-4 bg-white rounded shadow">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search by Name</label>
            <Input
              placeholder="Search video by title"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Language
            </label>
            <Select
              style={{ width: '100%' }}
              placeholder="Select language"
              allowClear
              value={selectedLanguage}
              onChange={(value) => setSelectedLanguage(value)}
            >
              <Select.Option value="English">English</Select.Option>
              <Select.Option value="Spanish">Spanish</Select.Option>
              <Select.Option value="French">French</Select.Option>
              <Select.Option value="Deutsch">Deutsch</Select.Option>
              <Select.Option value="Italian">Italian</Select.Option>
              <Select.Option value="Arabic">Arabic</Select.Option>
              <Select.Option value="Chinese">Chinese</Select.Option>
              <Select.Option value="Japanese">Japanese</Select.Option>
              <Select.Option value="Korean">Korean</Select.Option>
              <Select.Option value="Portuguese">Portuguese</Select.Option>
              <Select.Option value="Russian">Russian</Select.Option>
              <Select.Option value="Hindi">Hindi</Select.Option>
            </Select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Location</label>
            <Select
              style={{ width: '100%' }}
              placeholder="Select location"
              allowClear
              value={selectedLocation}
              onChange={(value) => setSelectedLocation(value)}
            >
              {Array.isArray(locations) && locations.map(loc => (
                <Select.Option key={loc._id} value={loc._id}>
                  {loc.name}
                </Select.Option>
              ))}
            </Select>
          </div>
          
          <div className="flex items-end">
            <button
              className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded"
              onClick={() => {
                setSearchName('');
                setSelectedLanguage(null);
                setSelectedLocation(null);
              }}
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      <div className="">
        {loading ? <Skeleton count={13} height={30} /> : 
          <>
            <Table 
              columns={columns} 
              dataSource={filteredVideos.map((item, index) => ({ ...item, key: item._id || index }))} 
              rowKey="key" 
              pagination={{
                pageSize: pageSize, 
                pageSizeOptions: [5,10,15,20], 
                total: filteredVideos.length,
                showTotal: (total) => `Total ${total} items`
              }}
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
          <h1>Are you sure want to delete <span className="font-bold">{video?.title || 'this video'}</span>?</h1>
        </Modal>
      </div>
    </Layout>
  );
};

export default VideosList;