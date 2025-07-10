// TermsConditions.js (Main Component)
import React, { useEffect, useState } from 'react';
import Layout from '../../layout/Layout';
import { FaEdit, FaPlus, FaEye, FaTrash } from "react-icons/fa";
import EditTermsCondition from './EditTermsCondition';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllTerms, deleteTerm } from '../../store/api';
import { Button, Select, Table, Space, Modal, Tag } from 'antd';
import Swal from 'sweetalert2';

function TermsConditions() {
  const [showModal, setShowModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [selectedTerm, setSelectedTerm] = useState(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [termToDelete, setTermToDelete] = useState(null);
  
  const { terms, loading } = useSelector(state => state.terms);
  
  const dispatch = useDispatch();

  const languages = [
      { value: 'English', label: 'English' },
    { value: 'Spanish', label: 'Spanish' },
    { value: 'French', label: 'French' },
       { value: 'Italian', label: 'Italian' },
    { value: 'Deutsch', label: 'Deutsch' },
    { value: 'Arabic', label: 'Arabic' },
       { value: 'Chinese', label: 'Chinese' },
    { value: 'Japanese', label: 'Japanese' },
    { value: 'Korean', label: 'Korean' },
        { value: 'Portuguese', label: 'Portuguese' },
    { value: 'Russian', label: 'Russian' },
    { value: 'Hindi', label: 'Hindi' },
    
    // Add more languages as needed
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchAllTerms(dispatch);
      } catch (error) {
        console.error("Failed to fetch terms:", error);
      }
    };
    fetchData();
  }, [dispatch]);

  const handleLanguageChange = (value) => {
    setSelectedLanguage(value);
  };

  const handleCreateNew = () => {
    setIsCreating(true);
    setSelectedTerm(null);
    setShowModal(true);
  };

  const handleEdit = (term) => {
    setIsCreating(false);
    setSelectedTerm(term);
    setShowModal(true);
  };

  const handleView = (term) => {
    Modal.info({
      title: `Terms & Conditions (${term.language})`,
      width: 800,
      content: (
        <div dangerouslySetInnerHTML={{ __html: term.content }} />
      ),
    });
  };

  const handleDeleteClick = (term) => {
    setTermToDelete(term);
    setDeleteModalVisible(true);
  };

const confirmDelete = async () => {
  try {
    await deleteTerm(termToDelete._id, dispatch); // Add dispatch here
    Swal.fire('Deleted!', 'Terms & Conditions have been deleted.', 'success');
    // No need to fetchAllTerms here as termDeleted updates the state
  } catch (error) {
    Swal.fire('Error!', error.message || 'Failed to delete', 'error');
  } finally {
    setDeleteModalVisible(false);
  }
};

const onHide = async () => {
  setShowModal(false);
  await fetchAllTerms(dispatch); // Refresh the list after modal closes
};


  const columns = [
    {
      title: 'S.N',
      render: (_, __, index) => <strong>{index + 1}</strong>,
    },
    {
      title: 'Language',
      dataIndex: 'language',
      render: (language) => (
        <Tag color="blue">{language}</Tag>
      ),
    },
    {
      title: 'Last Updated',
      dataIndex: 'updatedAt',
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Actions',
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="text" 
            icon={<FaEye />} 
            onClick={() => handleView(record)}
            title="View"
          />
          <Button 
            type="text" 
            icon={<FaEdit />} 
            onClick={() => handleEdit(record)}
            title="Edit"
          />
          <Button 
            type="text" 
            danger 
            icon={<FaTrash />} 
            onClick={() => handleDeleteClick(record)}
            title="Delete"
          />
        </Space>
      ),
    },
  ];

  return (
    <Layout>
      <div className="p-4">
        <div className='flex justify-between items-center mb-4'>
          <h1 className='text-xl font-bold text-gray-600'>Terms & Conditions</h1>
          <div className="flex items-center gap-4">
         
            <Button 
              type="primary" 
              icon={<FaPlus />} 
              onClick={handleCreateNew}
            >
              Create New
            </Button>
          </div>
        </div>

        <Table
          columns={columns}
          dataSource={terms}
          rowKey="_id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ['5', '10', '20', '50'],
          }}
        />

        {showModal && (
          <EditTermsCondition 
            onHide={onHide} 
            isCreating={isCreating} 
            language={selectedLanguage}
            existingTerm={selectedTerm}
          />
        )}

        <Modal
          title="Confirm Delete"
          open={deleteModalVisible}
          onOk={confirmDelete}
          onCancel={() => setDeleteModalVisible(false)}
          okText="Delete"
          okButtonProps={{ danger: true }}
        >
          <p>Are you sure you want to delete the terms & conditions for {termToDelete?.language}?</p>
        </Modal>
      </div>
    </Layout>
  );
}

export default TermsConditions;