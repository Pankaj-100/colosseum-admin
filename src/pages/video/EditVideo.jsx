import React, { useEffect, useState } from 'react';
import Layout from '../../layout/Layout';
import { Image, Modal, Input, Select, Form, Button } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getVideoDetails } from '../../store/api';
import axiosInstance from '../../utils/axios';
import Swal from 'sweetalert2';

const { TextArea } = Input;
const { Option } = Select;

function EditVideo() {
    const [loading, setLoading] = useState(false);
    const { video } = useSelector(state => state.video);
    const [form, setForm] = useState({
        title: '',
        description: '',
        language: 'English',
        duration: {
            hours: 0,
            minutes: 0,
            seconds: 0
        }
    });

    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    useEffect(() => {
        getVideoDetails(dispatch, id);
    }, [dispatch, id]);
    
    useEffect(() => {
        if (video) {
            setForm({
                title: video.title || '',
                description: video.description || '',
                language: video.language || 'English',
                duration: video.duration || { hours: 0, minutes: 0, seconds: 0 }
            });
        }
    }, [video]);

    async function updateVideo() {
        try {
            setLoading(true);
            const { data } = await axiosInstance.put(`api/video/${id}`, form);
            if (data.success) {
                Swal.fire('Success!', 'Video updated successfully', 'success');
            }
        } catch (error) {
            Swal.fire('Error!', error.response?.data?.message || 'Something went wrong', 'error');
        } finally {
            setLoading(false);
        }
    }

    const [isModalOpen, setIsModalOpen] = useState(true);
    
    const handleOk = () => {
        updateVideo().then(() => {
            setIsModalOpen(false);
            navigate('/videos');
        });
    };
    
    const handleCancel = () => {
        setIsModalOpen(false);
        navigate('/videos');
    };
    
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleDurationChange = (field, value) => {
        setForm(prev => ({
            ...prev,
            duration: {
                ...prev.duration,
                [field]: parseInt(value) || 0
            }
        }));
    };

    return (
        <Layout>
            <Modal 
                title={loading ? 'Loading...' : `Edit ${video?.title || 'Video'}`}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                confirmLoading={loading}
                width={700}
            >
                <div className="flex justify-center mb-4">
                    <Image
                        src={video?.thumbnailUrl}
                        alt="Video Thumbnail"
                        width={200}
                        preview={false}
                    />
                </div>
                
                <Form layout="vertical">
                    <Form.Item label="Title">
                        <Input
                            name="title"
                            value={form.title}
                            onChange={handleInputChange}
                            placeholder="Video title"
                        />
                    </Form.Item>
                    
                    <Form.Item label="Description">
                        <TextArea
                            name="description"
                            value={form.description}
                            onChange={handleInputChange}
                            rows={4}
                            placeholder="Video description"
                        />
                    </Form.Item>
                    
                    <Form.Item label="Language">
                        <Select
                            value={form.language}
                            onChange={(value) => setForm(prev => ({ ...prev, language: value }))}
                        >
                            <Option value="English">English</Option>
                            <Option value="Spanish">Spanish</Option>
                            <Option value="French">French</Option>
                            <Option value="German">German</Option>
                        </Select>
                    </Form.Item>
                    
                  {/* <div className="grid grid-cols-3 gap-4">
                        <Form.Item label="Hours">
                            <Input
                                type="number"
                                min={0}
                                value={form.duration.hours}
                                onChange={(e) => handleDurationChange('hours', e.target.value)}
                            />
                        </Form.Item>
                        <Form.Item label="Minutes">
                            <Input
                                type="number"
                                min={0}
                                max={59}
                                value={form.duration.minutes}
                                onChange={(e) => handleDurationChange('minutes', e.target.value)}
                            />
                        </Form.Item>
                        <Form.Item label="Seconds">
                            <Input
                                type="number"
                                min={0}
                                max={59}
                                value={form.duration.seconds}
                                onChange={(e) => handleDurationChange('seconds', e.target.value)}
                            />
                        </Form.Item>
                    </div> */}
                </Form>
            </Modal>
        </Layout>
    );
}

export default EditVideo;