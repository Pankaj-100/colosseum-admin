import React, { useState } from 'react';
import { EditOutlined, EllipsisOutlined, DeleteOutlined ,EyeOutlined, PhoneOutlined, MailOutlined} from '@ant-design/icons';
import { Avatar, Card, Flex, Image, Switch } from 'antd';
import { Button, Modal } from 'antd';
import { Link } from 'react-router-dom';

function UserCard({type}) {
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalOpen2, setIsModalOpen2] = useState(false);

    const showModal = () => {
      setIsModalOpen(true);
    };
    const handleOk = () => {
      setIsModalOpen(false);
      console.log('user fpund');
    };
    const handleCancel = () => {
      setIsModalOpen(false);
    };
 
       const actions = [
        
        <p className='text-end mr-3 text-xs'>13min ago</p>
      //  <Link to={'/users/1'}> <EyeOutlined   key="view"  className='mt-0'/></Link> ,
      //   <DeleteOutlined  key="delete" onClick={showModal}/>,
      ];

  return (
    <Flex gap="middle" align="start" vertical>
    {/* <Switch checked={!loading} onChange={(checked) => setLoading(!checked)} /> */}
   <Link to={`/${type}/1`} className='hover:scale-[1.01] hover:shadow-md transition-shadow'>
   <Card
      loading={loading}
      actions={actions}
      style={{
        minWidth: 300,
      }} 
     
    >
      <Card.Meta
        avatar={<Image width={40} className='border border-gray-300 rounded-full' preview={true} movable={true} src='https://api.dicebear.com/7.x/miniavs/svg?seed=1'/>}
        title="John deo"
        description={
          <>
            <p><MailOutlined className='mr-2 ' /> dummy@gmail.com</p>
            <p><PhoneOutlined className='mr-2'/> +91 9192939495</p>
          </>
        }
      />
    </Card>
   
   </Link>
    <Modal title="Deletion confirmation"  open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
          <p>Are you sure want to delete this user !</p>
          
        </Modal>
      
  </Flex>
  )
}

export default UserCard