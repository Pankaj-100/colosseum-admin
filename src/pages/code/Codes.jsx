import React, { useEffect, useState } from "react";
import Layout from "../../layout/Layout";
import { useDispatch, useSelector } from "react-redux";
import { Table, Select, Space, Modal, Button, InputNumber } from "antd";
import { FiEye } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import {
  getActiveCodes,
  generateCodes,
  revokeCode,
} from "../../store/api";
import SearchBar from "../../component/SearchBar";
import Swal from "sweetalert2";

function Codes() {
  const dispatch = useDispatch();
  const { codes, loading, count, search } = useSelector((state) => state.code);
  const [pageSize, setPageSize] = useState(5);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [codeToRevoke, setCodeToRevoke] = useState(null);
  const [generateCount, setGenerateCount] = useState(1);

  useEffect(() => {
    getActiveCodes(dispatch);
  }, [dispatch]);

  const handleGenerate = async () => {
    if (!generateCount || generateCount < 1) return Swal.fire("Invalid count");
    await generateCodes(dispatch, { count: generateCount });
    getActiveCodes(dispatch);
  };

  const handleRevoke = async () => {
    await revokeCode(dispatch, codeToRevoke);
    getActiveCodes(dispatch);
    setIsModalOpen(false);
   
     
   
  };

  const columns = [
    {
      title: "S.N",
      key: "sn",
      render: (_, __, index) => <span>{index + 1}</span>,
    },
    {
      title: "Code",
      dataIndex: "plainCode",
      key: "plainCode",
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => new Date(text).toLocaleString(),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button danger onClick={() => showModal(record.plainCode)}>
            <MdDelete />
          </Button>
        </Space>
      ),
    },
  ];

  const showModal = (plainCode) => {
    setCodeToRevoke(plainCode);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setCodeToRevoke(null);
  };

  return (
    <Layout>
      <div className="flex justify-between items-center m-3">
        <h1 className="text-xl font-bold text-gray-600">Activation Codes</h1>
        <SearchBar type="code" placeholder="Search code..." />
      </div>

      <div className="flex items-center gap-4 mb-4 mx-3">
        <InputNumber
          min={1}
          value={generateCount}
          onChange={(val) => setGenerateCount(val)}
          placeholder="Number of codes"
        />
        <Button type="primary" onClick={handleGenerate}>
          Generate Codes
        </Button>
      </div>

      <Table
        loading={loading}
        dataSource={codes.map((item, index) => ({ ...item, key: item._id || index }))}
        columns={columns}
        pagination={{
          pageSize,
          pageSizeOptions: [5, 10, 20, 50],
          total: count,
        }}
      />

      <Select
        defaultValue={pageSize}
        style={{ marginTop: "-20px" }}
        onChange={(value) => setPageSize(value)}
      >
        <Select.Option value={5}>5</Select.Option>
        <Select.Option value={10}>10</Select.Option>
        <Select.Option value={20}>20</Select.Option>
        <Select.Option value={50}>50</Select.Option>
      </Select>

      <Modal
        title="Revoke Code"
        open={isModalOpen}
        onOk={handleRevoke}
        onCancel={handleCancel}
      >
        <p>Are you sure you want to revoke this code?</p>
        <code>{codeToRevoke}</code>
      </Modal>
    </Layout>
  );
}

export default Codes;
