import React, { useEffect, useState } from "react";
import Layout from "../../layout/Layout";
import { Table, Modal, Image, Button, Input, Form, Upload, message } from "antd";
import { MdDelete, MdModeEdit } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { UploadOutlined } from "@ant-design/icons";
import { 
  getLocations, 
  addLocation, 
  updateLocation, 
  deleteLocation 
} from "../../store/api";

function Location() {
  const dispatch = useDispatch();
  const [pageSize, setPageSize] = useState(10);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [editThumbnailFile, setEditThumbnailFile] = useState(null);

  const { locations, loading } = useSelector(state => state.location);

  const [form] = Form.useForm();
  const [editForm] = Form.useForm();

  useEffect(() => {
    getLocations(dispatch);
  }, [dispatch]);

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
      await deleteLocation(dispatch, selectedLocation._id);
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const handleAddLocation = async (values) => {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("size", values.size);
    if (thumbnailFile) {
      formData.append("image", thumbnailFile);
    }

    try {
      await addLocation(dispatch, formData);
      form.resetFields();
      setThumbnailFile(null);
      setAddModalOpen(false);
    } catch (error) {
      console.error("Add error:", error);
    }
  };

  const handleUpdateLocation = async (values) => {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("size", values.size);
    if (editThumbnailFile) {
      formData.append("image", editThumbnailFile);
    }

    try {
      await updateLocation(dispatch, selectedLocation._id, formData);
      editForm.resetFields();
      setEditThumbnailFile(null);
      setEditModalOpen(false);
    } catch (error) {
      console.error("Update error:", error);
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
        <div className="flex gap-4">
          <span className="text-blue-600 cursor-pointer" onClick={() => showEditModal(record)}>
            <MdModeEdit size={18} />
          </span>
          <span className="text-red-600 cursor-pointer" onClick={() => showDeleteModal(record)}>
            <MdDelete size={18} />
          </span>
        </div>
      ),
    },
  ];

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Locations</h1>
        <Button type="primary" onClick={() => setAddModalOpen(true)}>
          Add Location
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={locations}
        loading={loading}
        rowKey="_id"
        pagination={{
          pageSize,
          showSizeChanger: true,
          onShowSizeChange: (_, size) => setPageSize(size),
        }}
      />

      {/* Delete Modal */}
      <Modal
        title="Confirm Delete"
        open={isDeleteModalOpen}
        onOk={handleDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
        okText="Delete"
        okButtonProps={{ danger: true }}
      >
        <p>Are you sure you want to delete <strong>{selectedLocation?.name}</strong>?</p>
      </Modal>

      {/* Add Modal */}
      <Modal
        title="Add Location"
        open={addModalOpen}
        onCancel={() => setAddModalOpen(false)}
        onOk={() => form.submit()}
        okText="Add"
      >
        <Form form={form} layout="vertical" onFinish={handleAddLocation}>
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Please enter location name' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Size"
            name="size"
            rules={[{ required: true, message: 'Please enter location size' }]}
          >
            <Input placeholder="e.g., 50MB, 100MB, 1GB" />
          </Form.Item>
          <Form.Item
            label="Thumbnail"
            rules={[{ required: true, message: 'Please upload a thumbnail' }]}
          >
            <Upload
              beforeUpload={(file) => {
                setThumbnailFile(file);
                return false;
              }}
              accept="image/*"
              maxCount={1}
            >
              <Button icon={<UploadOutlined />}>Select File</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit Modal */}
      <Modal
        title="Edit Location"
        open={editModalOpen}
        onCancel={() => setEditModalOpen(false)}
        onOk={() => editForm.submit()}
        okText="Update"
      >
        <Form form={editForm} layout="vertical" onFinish={handleUpdateLocation}>
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Please enter location name' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Size"
            name="size"
            rules={[{ required: true, message: 'Please enter location size' }]}
          >
            <Input placeholder="e.g., 50MB, 100MB, 1GB" />
          </Form.Item>
          <Form.Item label="Thumbnail">
            <Upload
              beforeUpload={(file) => {
                setEditThumbnailFile(file);
                return false;
              }}
              accept="image/*"
              maxCount={1}
            >
              <Button icon={<UploadOutlined />}>Select New File</Button>
            </Upload>
            {selectedLocation?.thumbnailUrl && (
              <Image 
                src={selectedLocation.thumbnailUrl} 
                width={100}
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