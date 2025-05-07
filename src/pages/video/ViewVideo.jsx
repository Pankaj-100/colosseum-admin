import React, { useEffect,useState } from 'react';
import Layout from '../../layout/Layout';
import { Image, Modal, Descriptions, Tag, Spin, Alert } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getVideoDetails } from '../../store/api';

function ViewVideo() {
    const { video, loading, error } = useSelector(state => state.video);
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const [isModalOpen, setIsModalOpen] = useState(true);

    useEffect(() => {
        getVideoDetails(dispatch, id);
    }, [dispatch, id]);

    const handleCancel = () => {
        setIsModalOpen(false);
        navigate('/videos');
    };

    if (loading) {
        return (
            <Layout>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                    <Spin size="large" tip="Loading video details..." />
                </div>
            </Layout>
        );
    }

    if (error) {
        return (
            <Layout>
                <Alert
                    message="Error"
                    description={error}
                    type="error"
                    showIcon
                    style={{ margin: '20px' }}
                />
            </Layout>
        );
    }

    return (
        <Layout>
            <Modal 
                title={video?.title || 'Video Details'}
                open={isModalOpen}
                onCancel={handleCancel}
                footer={null}
                width={800}
                destroyOnClose
            >
                {video ? (
                    <div className="space-y-4">
                        <div className="flex justify-center">
                            <Image
                                src={video.thumbnailUrl}
                                alt="Video Thumbnail"
                                width={300}
                                preview={false}
                            />
                        </div>
                        
                        <Descriptions bordered column={1}>
                            <Descriptions.Item label="Title">{video.title}</Descriptions.Item>
                            <Descriptions.Item label="Description">
                                {video.description || 'No description available'}
                            </Descriptions.Item>
                         
                            <Descriptions.Item label="Language">
                                <Tag color="blue">{video.language || 'Unknown'}</Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="Video URL">
                                {video.videoUrl ? (
                                    <a href={video.videoUrl} target="_blank" rel="noopener noreferrer">
                                        Watch Video
                                    </a>
                                ) : 'URL not available'}
                            </Descriptions.Item>
                        </Descriptions>
                    </div>
                ) : (
                    <Alert
                        message="No video data available"
                        type="warning"
                        showIcon
                    />
                )}
            </Modal>
        </Layout>
    );
}

export default ViewVideo;