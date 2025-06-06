import React, { useEffect, useState } from "react";
import Layout from "../../layout/Layout";
import {
  Table,
  Space,
  Modal,
  Image,
  Select,
  Button,
  Input,
  Form,
  Upload,
} from "antd";
import { MdDelete, MdModeEdit } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import SearchBar from "../../component/SearchBar";
import Skeleton from "react-loading-skeleton";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import axiosInstance from "../../utils/axios";
import { getLocations } from "../../store/api";
import { UploadOutlined } from "@ant-design/icons";

function Location() {
  const dispatch = useDispatch();
  const [pageSize, setPageSize] = useState(5);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [editThumbnailFile, setEditThumbnailFile] = useState(null);

  const { locations, loading, count, search } = useSelector(state => state.location);
  const { contentlang } = useSelector(state => state.language);

  const [form] = Form.useForm();
  const [editForm] = Form.useForm();

  useEffect(() => {
    getLocations(dispatch, search);
  }, [dispatch, search]);

  const showDeleteModal = (location) => {
    setSelectedLocation(location);
    setIsDeleteModalOpen(true);
  };

  const showEditModal = (location) => {
    setSelectedLocation(location);
    editForm.setFieldsValue({
      name: location.name,
      size: location.size
    });
    setEditModalOpen(true);
  };

  const handleDelete = async () => {
    try {
      const { data } = await axiosInstance.delete(`/api/location/${selectedLocation._id}`);
      if (data.success) {
        Swal.fire("Deleted!", "Location deleted successfully.", "success");
        getLocations(dispatch, search);
      }
    } catch (error) {
      Swal.fire("Error!", error?.response?.data?.message || "Failed to delete", "error");
    } finally {
      setIsDeleteModalOpen(false);
    }
  };

  const handleAddLocation = async (values) => {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("size", values.size);
    if (thumbnailFile) {
      formData.append("thumbnail", thumbnailFile);
    }

    try {
      const { data } = await axiosInstance.post(`/api/location`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (data.success) {
        Swal.fire("Added!", "Location added successfully.", "success");
        form.resetFields();
        setThumbnailFile(null);
        setAddModalOpen(false);
        getLocations(dispatch, search);
      }
    } catch (error) {
      Swal.fire("Error!", error?.response?.data?.message || "Failed to add", "error");
    }
  };

  const handleUpdateLocation = async (values) => {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("size", values.size);
    if (editThumbnailFile) {
      formData.append("thumbnail", editThumbnailFile);
    }

    try {
      const { data } = await axiosInstance.put(`/api/location/${selectedLocation._id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (data.success) {
        Swal.fire("Updated!", "Location updated successfully.", "success");
        editForm.resetFields();
        setEditThumbnailFile(null);
        setEditModalOpen(false);
        getLocations(dispatch, search);
      }
    } catch (error) {
      Swal.fire("Error!", error?.response?.data?.message || "Failed to update", "error");
    }
  };

  const columns = [
    {
      title: "S.N",
      render: (_, __, index) => <strong>{index + 1}</strong>,
    },
    {
      title: "Thumbnail",
      dataIndex: "thumbnailUrl",
      render: (url) => <Image width={50} height={50} src={url} />,
    },
    {
      title: "Location Name",
      dataIndex: "name",
    },
    {
      title: "Size",
      dataIndex: "size",
    },
    {
      title: "Actions",
      render: (_, record) => (
        <Space>
          <span className="text-blue-600 cursor-pointer" onClick={() => showEditModal(record)}>
            <MdModeEdit />
          </span>
          <span className="text-red-600 cursor-pointer" onClick={() => showDeleteModal(record)}>
            <MdDelete />
          </span>
        </Space>
      ),
    },
  ];

  return (
    <Layout>
      <div className="flex justify-between items-center mx-3 mb-3">
        <h1 className="text-xl font-bold text-gray-500">Locations</h1>
        <div className="flex gap-3">
          <Button type="primary" onClick={() => setAddModalOpen(true)}>Add Location</Button>
        </div>
      </div>

      {loading ? (
        <Skeleton count={10} />
      ) : (
        <>
          <Table
            columns={columns}
            dataSource={locations.map((loc, i) => ({ ...loc, key: loc._id || i }))}
            pagination={{
              pageSize,
              total: count,
              showSizeChanger: false,
            }}
          />
          <Select
            value={pageSize}
            onChange={setPageSize}
            style={{ marginTop: 10 }}
          >
            {[5, 10, 20, 50].map(size => (
              <Select.Option key={size} value={size}>{size}</Select.Option>
            ))}
          </Select>
        </>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        title="Delete Location"
        open={isDeleteModalOpen}
        onOk={handleDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
      >
        <p>Are you sure you want to delete <strong>{selectedLocation?.name}</strong>?</p>
      </Modal>

      {/* Add Location Modal */}
      <Modal
        title="Add New Location"
        open={addModalOpen}
        onCancel={() => setAddModalOpen(false)}
        onOk={() => form.submit()}
        okText="Add"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddLocation}
        >
          <Form.Item
            label="Location Name"
            name="name"
            rules={[{ required: true, message: 'Please enter location name' }]}
          >
            <Input placeholder="Enter name" />
          </Form.Item>

          <Form.Item
            label="Size"
            name="size"
            rules={[{ 
              required: true, 
              message: 'Please enter size (e.g., 50MB, 100MB, 1GB)' 
            }]}
          >
            <Input placeholder="Enter size (e.g., 50MB, 100MB, 1GB)" />
          </Form.Item>

          <Form.Item
            label="Thumbnail Image"
            rules={[{ required: true, message: 'Please upload a thumbnail image' }]}
          >
            <Upload
              beforeUpload={(file) => {
                setThumbnailFile(file);
                return false;
              }}
              accept="image/*"
              maxCount={1}
            >
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit Location Modal */}
      <Modal
        title="Edit Location"
        open={editModalOpen}
        onCancel={() => setEditModalOpen(false)}
        onOk={() => editForm.submit()}
        okText="Update"
      >
        <Form
          form={editForm}
          layout="vertical"
          onFinish={handleUpdateLocation}
        >
          <Form.Item
            label="Location Name"
            name="name"
            rules={[{ required: true, message: 'Please enter location name' }]}
          >
            <Input placeholder="Enter name" />
          </Form.Item>

          <Form.Item
            label="Size"
            name="size"
            rules={[{ 
              required: true, 
              message: 'Please enter size (e.g., 50MB, 100MB, 1GB)' 
            }]}
          >
            <Input placeholder="Enter size (e.g., 50MB, 100MB, 1GB)" />
          </Form.Item>

          <Form.Item
            label="Thumbnail Image"
          >
            <Upload
              beforeUpload={(file) => {
                setEditThumbnailFile(file);
                return false;
              }}
              accept="image/*"
              maxCount={1}
            >
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
            {selectedLocation?.thumbnailUrl && (
              <Image 
                width={100} 
                src={selectedLocation.thumbnailUrl} 
                style={{ marginTop: 10 }}
              />
            )}
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
}

export default Location;