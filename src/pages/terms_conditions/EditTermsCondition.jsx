// EditTermsCondition.js
import React, { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import "react-quill/dist/quill.snow.css";
import { useDispatch } from 'react-redux';
import Swal from 'sweetalert2';
import { Button, Form, Select, Modal } from 'antd';
import { updateTerm,createTerm  } from "../../store/api";
function EditTermsCondition({ onHide, isCreating, language, existingTerm }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [content, setContent] = useState('');
  const [contentError, setContentError] = useState('');

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
    // Add more languages as needed
  ];

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike"],
      ["link"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["blockquote", "code-block"],
      [{ color: [] }, { background: [] }],
      ["clean"],
      ["paragraph"],
      [{ align: [] }],
      [{ font: [] }],
      [{ script: "sub" }, { script: "super" }],
      [{ indent: "-1" }, { indent: "+1" }],
      [{ direction: "rtl" }],
    ],
  };

  const formats = [
    "bold", "italic", "underline", "strike", "blockquote", 
    "list", "bullet", "link", "font", "align", "color",
    "header", "indent", "size",  "clean",  "direction",
  ];

  useEffect(() => {
    if (existingTerm) {
      setContent(existingTerm.content || '');
      form.setFieldsValue({
        language: existingTerm.language
      });
    } else {
      form.setFieldsValue({
        language: language
      });
    }
  }, [dispatch]);

  const validateContent = () => {
    if (!content || content === '<p><br></p>') {
      setContentError('Content is required');
      return false;
    }
    setContentError('');
    return true;
  };

const handleSubmit = async (values) => {
  console.log("hello")
  if (!validateContent()) return;

  try {
    setLoading(true);
    const termData = {
      language: values.language,
      content: content,
    };

    if (isCreating) {
    
      await createTerm(termData, dispatch);
    } else {
      await updateTerm(existingTerm._id, termData, dispatch);
    }

    setLoading(false);
    onHide();
    
  } catch (error) {
    setLoading(false);
   
  }
};
  return (
    <Modal
      title={isCreating ? 'Create New Terms & Conditions' : 'Edit Terms & Conditions'}
      open={true}
      onCancel={onHide}
      footer={null}
      width={800}
    >
      <div className="bg-white p-6 rounded-lg">
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item
            name="language"
            label="Language"
          
            rules={[{ required: true, message: 'Please select a language' }]}
          >
            <Select 
              options={languages} 
              disabled={!isCreating}
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item
            label="Content"
            required
            validateStatus={contentError ? 'error' : ''}
            help={contentError}
          >
            <ReactQuill
              value={content}
              onChange={setContent}
              onBlur={validateContent}
              modules={modules}
              formats={formats}
              className='border border-gray-300 rounded mb-4'
              style={{ height: '300px' }}
            />
          </Form.Item>

          <div className='flex justify-end gap-4'>
            <Button onClick={onHide} disabled={loading}>
              Cancel
            </Button>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
            >
              {isCreating ? 'Create' : 'Update'}
            </Button>
          </div>
        </Form>
      </div>
    </Modal>
  );
}

export default EditTermsCondition;