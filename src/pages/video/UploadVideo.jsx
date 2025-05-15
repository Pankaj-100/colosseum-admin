import React, { useState, useRef, useEffect } from 'react'; 
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Spin } from 'antd';
import { 
  getUploadUrl, 
  saveVideoDetails,
 
  getLocations
} from '../../store/api';
import { 
  Button, 
  Form, 
  Input, 
  Upload, 
  Progress, 
  Select, 
  Space,
  Switch,
  InputNumber,
  Modal,
  Radio
} from 'antd';
import { UploadOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import Swal from 'sweetalert2';

const { Option } = Select;
const { TextArea } = Input;

const UploadVideo = () => {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { uploadProgress } = useSelector(state => state.video);
  const { locations: allLocations } = useSelector(state => state.location);
  const [form] = Form.useForm();
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [duration, setDuration] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [isGeolocationEnabled, setIsGeolocationEnabled] = useState(false);
  const [locations, setLocations] = useState([]);
  const [primaryLocation, setPrimaryLocation] = useState(null);
  const [isMapModalVisible, setIsMapModalVisible] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const uploadRef = useRef(null);

  useEffect(() => {
    // Fetch all locations when component mounts
    getLocations(dispatch);
  }, [dispatch]);

  const handleVideoChange = (info) => {
    if (info.file.status === 'removed') {
      setVideoFile(null);
      return;
    }

    const file = info.file;
    setVideoFile(file);

    const videoElement = document.createElement("video");
    videoElement.preload = "metadata";

    videoElement.onloadedmetadata = function () {
      window.URL.revokeObjectURL(videoElement.src);
      const durationSec = videoElement.duration;

      const newDuration = {
        hours: Math.floor(durationSec / 3600),
        minutes: Math.floor((durationSec % 3600) / 60),
        seconds: Math.floor(durationSec % 60),
      };

      setDuration(newDuration);
    };

    videoElement.src = URL.createObjectURL(file.originFileObj || file);
  };

  const handleThumbnailChange = (info) => {
    if (info.file.status === 'removed') {
      setThumbnailFile(null);
      return;
    }
    setThumbnailFile(info.file);
  };

  const handleGeolocationToggle = (checked) => {
    setIsGeolocationEnabled(checked);
    if (!checked) {
      setLocations([]);
      // Clear primary location if it was a custom location
      if (primaryLocation && typeof primaryLocation === 'string' && primaryLocation.startsWith('custom-')) {
        setPrimaryLocation(null);
      }
    }
  };

  const showMapModal = (index = null) => {
    if (index !== null) {
      setCurrentLocation({ ...locations[index], index });
    } else {
      setCurrentLocation({
        locationName: '',
        coordinates: [0, 0],
        radius: 1000,
      });
    }
    setIsMapModalVisible(true);
  };

  const handleMapOk = () => {
    if (currentLocation.index !== undefined) {
      const updatedLocations = [...locations];
      updatedLocations[currentLocation.index] = currentLocation;
      setLocations(updatedLocations);
    } else {
      setLocations([...locations, currentLocation]);
    }
    setIsMapModalVisible(false);
    setCurrentLocation(null);
  };

  const handleMapCancel = () => {
    setIsMapModalVisible(false);
    setCurrentLocation(null);
  };

  const removeLocation = (index) => {
    const newLocations = [...locations];
    newLocations.splice(index, 1);
    setLocations(newLocations);
    
    // If the deleted location was set as primary, clear the primary location
    if (primaryLocation === `custom-${index}`) {
      setPrimaryLocation(null);
    }
  };

  const handleCoordinateChange = (lat, lng) => {
    setCurrentLocation({
      ...currentLocation,
      coordinates: [lng, lat]
    });
  };

  const handleSubmit = async (values) => {
    if (!videoFile) {
      Swal.fire('Error!', 'Please select a video file', 'error');
      return;
    }

    try {
      setIsLoading(true); 
      const fileName = videoFile.name;
      const fileExtension = fileName.split('.').pop();
      
      const uploadData = await getUploadUrl(dispatch, fileExtension);
console.log("1")
      await fetch(uploadData.uploadURL, {
        method: "PUT",
        body: videoFile
      });
console.log("2")
      const cleanUrl = new URL(uploadData.uploadURL);
      cleanUrl.search = "";
      const stringUrl = cleanUrl.toString();

      let thumburl = "";
      if (thumbnailFile) {
        const thumbnailUploadData = await getUploadUrl(dispatch, 'jpg');
        await fetch(thumbnailUploadData.uploadURL, {
          method: "PUT",
          body: thumbnailFile
        });
        const thumbnailUrl = new URL(thumbnailUploadData.uploadURL);
        thumbnailUrl.search = "";
        thumburl = thumbnailUrl.toString();
      }
console.log("3")
      // Prepare primary location data
    
    

      const videoData = {
        title: values.title,
        description: values.description,
        thumbnailUrl: thumburl,
        videoUrl: stringUrl,
        language: values.language,
        duration,
        primaryLocation: values.primaryLocation,
        geolocationSettings: {
          isGeolocationEnabled,
          locations: locations.map(loc => ({
            type: 'Point',
            coordinates: loc.coordinates,
            radius: loc.radius,
            locationName: loc.locationName
          }))
        }
      };
console.log("4")
      await saveVideoDetails(dispatch, videoData);
console.log("5")
      form.resetFields();
      setVideoFile(null);
      setThumbnailFile(null);
      setIsGeolocationEnabled(false);
      setLocations([]);
      setPrimaryLocation(null);

      Swal.fire('Success!', 'Video uploaded successfully!', 'success');
    } catch (error) {
      console.error('Error in video upload:', error);
      Swal.fire('Error!', 'Video upload failed. Please try again.', 'error');
    }
    finally {
      setIsLoading(false); // STOP LOADING
    }
  
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <div className='flex justify-between'>
      <h2 className="text-xl font-bold mb-6">Upload New Video</h2>
      <Button type="default" onClick={() => navigate(-1)} className="bg-red-500 hover:bg-red-600">
  ← Back
</Button>
      </div>
   
      
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item name="title" label="Title" rules={[{ required: true }]}>
          <Input placeholder="Enter video title" />
        </Form.Item>

        <Form.Item name="description" label="Description" rules={[{ required: true }]}>
          <TextArea rows={4} placeholder="Enter video description" />
        </Form.Item>

        <Form.Item name="language" label="Language" rules={[{ required: true }]}>
          <Select placeholder="Select language">
            <Option value="English">English</Option>
            <Option value="Spanish">Spanish</Option>
            <Option value="French">French</Option>
            <Option value="German">German</Option>
             <Option value="Italian">Italian</Option>
                <Option value="Arabic">Arabic</Option>
        
          </Select>
        </Form.Item>

        <Form.Item
  label="Primary Location"
  name="primaryLocation"  // important for Form values
  rules={[{ required: true, message: "Please select a primary location" }]}
>
  <Select
    placeholder="Select a primary location"
    onChange={(value) => {
      setPrimaryLocation(value); // optional if you're manually tracking it
      if (value && !isGeolocationEnabled) {
        setIsGeolocationEnabled(true);
      }
    }}
    allowClear
    disabled={!allLocations.length}
  >
    {allLocations.map((location) => (
      <Select.Option key={location._id} value={location.name}>
        {location.name}
      </Select.Option>
    ))}
  </Select>
  {!allLocations.length && (
    <p className="text-sm text-gray-500">No locations available. Add locations first.</p>
  )}
</Form.Item>


        <Form.Item label="Geolocation Restrictions">
          <Switch 
            checked={isGeolocationEnabled}
            onChange={handleGeolocationToggle}
            checkedChildren="Enabled"
            unCheckedChildren="Disabled"
          />
        </Form.Item>

        {isGeolocationEnabled && (
          <Form.Item label="Allowed Locations">
            <div className="mb-4">
              {locations.map((loc, i) => (
                <div key={i} className="p-3 mb-2 border rounded flex justify-between items-center">
                  <div>
                    <strong>{loc.locationName || 'Unnamed Location'}</strong>
                    <div>Coordinates: {loc.coordinates[1]}, {loc.coordinates[0]}</div>
                    <div>Radius: {loc.radius} meters</div>
                    <Radio 
                      checked={primaryLocation === `custom-${i}`}
                      onChange={() => setPrimaryLocation(`custom-${i}`)}
                    >
                      Set as Primary Location
                    </Radio>
                  </div>
                  <Space>
                    <Button size="small" type="primary" onClick={() => showMapModal(i)}>Edit</Button>
                    <Button size="small" danger icon={<DeleteOutlined />} onClick={() => removeLocation(i)} />
                  </Space>
                </div>
              ))}
            </div>
            <Button type="dashed" icon={<PlusOutlined />} onClick={() => showMapModal()}>
              Add Location
            </Button>
          </Form.Item>
        )}

        <Form.Item label="Video File" required>
          <Upload
            ref={uploadRef}
            beforeUpload={() => false}
            onChange={handleVideoChange}
            maxCount={1}
            accept="video/*"
          >
            <Button icon={<UploadOutlined />}>Select Video</Button>
          </Upload>
          {videoFile && <div className="mt-2">Selected: {videoFile.name}</div>}
        </Form.Item>

        <Form.Item label="Thumbnail Image (Optional)">
          <Upload
            beforeUpload={() => false}
            onChange={handleThumbnailChange}
            maxCount={1}
            accept="image/*"
          >
            <Button icon={<UploadOutlined />}>Select Thumbnail</Button>
          </Upload>
          {thumbnailFile && <div className="mt-2">Selected: {thumbnailFile.name}</div>}
        </Form.Item>

        {uploadProgress > 0 && uploadProgress < 100 && (
          <div className="mb-4">
            <Progress percent={uploadProgress} status="active" />
            <p className="text-sm text-gray-500">Uploading video...</p>
          </div>
        )}

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={uploadProgress > 0}>
            Upload Video
          </Button>
        </Form.Item>
      </Form>

      {/* Map Modal */}
      <Modal
        title={currentLocation?.index !== undefined ? "Edit Location" : "Add New Location"}
        open={isMapModalVisible}
        onOk={handleMapOk}
        onCancel={handleMapCancel}
        width={800}
      >
        <Form layout="vertical">
          <Form.Item label="Location Name">
            <Input
              value={currentLocation?.locationName || ''}
              onChange={(e) => setCurrentLocation({ ...currentLocation, locationName: e.target.value })}
              placeholder="Enter location name"
            />
          </Form.Item>

          <Form.Item label="Radius (meters)">
            <InputNumber
              min={1}
              max={100000}
              value={currentLocation?.radius || 1000}
              onChange={(value) => setCurrentLocation({ ...currentLocation, radius: value })}
            />
          </Form.Item>

          <Form.Item label="Coordinates">
            <div style={{ height: '400px', background: '#f0f0f0', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <div>
                <p>Latitude: {currentLocation?.coordinates[1] || 0}</p>
                <p>Longitude: {currentLocation?.coordinates[0] || 0}</p>
                <Button type="primary" onClick={() => {
                  const lat = Math.random() * 180 - 90;
                  const lng = Math.random() * 360 - 180;
                  handleCoordinateChange(lat, lng);
                }}>
                  Simulate Map Click
                </Button>
              </div>
            </div>
          </Form.Item>
        </Form>
      </Modal>
      {isLoading && (
  <div className="fixed inset-0 bg-white bg-opacity-70 z-50 flex items-center justify-center">
    <div className="text-center">
      <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full border-blue-500 border-t-transparent"></div>
      <p className="mt-4 text-lg text-gray-700">Uploading, please wait...</p>
    </div>
  </div>
)}
    </div>
 
  );
};

export default UploadVideo;