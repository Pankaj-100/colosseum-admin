import React, { useEffect, useState } from 'react'
import Layout from '../../layout/Layout'
import ReactQuill from 'react-quill';
import "react-quill/dist/quill.snow.css";
import useSelection from 'antd/es/table/hooks/useSelection';
import { useDispatch, useSelector } from 'react-redux';
import { getTerms } from '../../store/api';
import axiosInstance from '../../utils/axios';
import Swal from 'sweetalert2';
import Spinner from '../../component/Spinner'
function EditTermsCondition(props) {

    // const [content,setContent] = useState('content')
    const {content} = useSelector(state=>state.terms)
   const [data,setData] = useState(content)
   const [loading,setLoading] = useState(false)
   const dispatch =  useDispatch()
    const modules = {
        toolbar: [
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          ["bold", "italic", "underline", "strike"],
          ["link", "image", "video"],
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
        "bold",
        "italic",
        "underline",
        "strike",
        "blockquote",
        "code-block",
        "list",
        "bullet",
        "link",
        "image",
        "video",
        "font",
        "align",
        "color",
        "background",
        "header",
        "indent",
        "size",
        "script",
        "clean",
        "code",
        "direction",
      ];
      useEffect(()=>{
  getTerms(dispatch)
      },[])
      const handleChange = (value) => {
        setData(value);
        console.log(value);
      };

      const  handleSubmit = async()=>{
       try {
        setLoading(true)
        const terms  = await axiosInstance.put('/admin/update-terms',{title:'terms & conditions',content:data})
        setLoading(false)
        props.onHide()
       } catch (error) {
         Swal.fire('Opps!','Something went wrong','error')
       }
      }
      const handleCancel = async ()=>{
        props.onHide()
      }
  return (
    <>
        
 
<ReactQuill value={data}  onChange={handleChange} modules={modules} formats={formats} className='border border-gray-600 mb-2 rounded '  />
        
        <div className='flex justify-end gap-2'>
            <button className='border border-gray-600 px-2 py-1 rounded hover:bg-gray-400' onClick={handleCancel}>Cancel</button>
            <button className='border border-blue-600 px-2 py-1 rounded bg-blue-500 hover:bg-gray-100' onClick={handleSubmit}>{loading ? <Spinner size={15}/> :'Submit'}</button>

        </div>
        </>
  )
}

export default EditTermsCondition