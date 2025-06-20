import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Spin } from 'antd';
import { uploadVideo, getLocations } from '../../store/api';
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
  Radio,
  AutoComplete
} from 'antd';
import { UploadOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import Swal from 'sweetalert2';
import { LoadScript, GoogleMap, MarkerF, CircleF } from '@react-google-maps/api';

const { Option } = Select;
const { TextArea } = Input;

const mapContainerStyle = {
  width: '100%',
  height: '400px'
};

const center = {
  lat: 41.8902,
  lng: 12.4922
};

const libraries = ['places'];

const UploadVideo = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [thumbnailError, setThumbnailError] = useState("");
  const [mapLoadError, setMapLoadError] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { uploadProgress } = useSelector(state => state.video);
  const { locations: allLocations } = useSelector(state => state.location);
  const [form] = Form.useForm();
  const [videoFile, setVideoFile] = useState(null);
  const [videoError, setVideoError] = useState('');
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [duration, setDuration] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [isGeolocationEnabled, setIsGeolocationEnabled] = useState(true);
  const [locations, setLocations] = useState([]);
  const [primaryLocation, setPrimaryLocation] = useState(null);
  const [isMapModalVisible, setIsMapModalVisible] = useState(false);
  const [currentLocation, setCurrentLocation] = useState({
    locationName: '',
    coordinates: [12.4922, 41.8902],
    radius: 100
  });
  const [mapCenter, setMapCenter] = useState(center);
  const [searchResults, setSearchResults] = useState([]);
  const uploadRef = useRef(null);
  const mapRef = useRef(null);
  const searchInputRef = useRef(null);

  useEffect(() => {
    getLocations(dispatch);
    
    return () => {
      if (mapRef.current) {
        mapRef.current = null;
      }
    };
  }, [dispatch]);

  const handleVideoChange = (info) => {
    if (info.file.status === 'removed') {
      setVideoFile(null);
      return;
    }

    const file = info.file;
    if (!validateVideoFile(file)) {
      return;
    }
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
    
    const file = info.file;
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      setThumbnailError("Only image files are allowed");
      return;
    }
    
    setThumbnailError("");
    setThumbnailFile(file);
  };

  const validateVideoFile = (file) => {
    setVideoError('');
    
    const validTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/x-matroska'];
    if (!validTypes.includes(file.type)) {
      setVideoError('Only MP4, MOV, AVI, or MKV files are allowed');
      return false;
    }

    const maxSizeMB = 50;
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSizeMB) {
      setVideoError(`File too large (max ${maxSizeMB}MB)`);
      return false;
    }

    return true;
  };

  const handleGeolocationToggle = (checked) => {
    setIsGeolocationEnabled(checked);
    if (!checked) {
      setLocations([]);
      if (primaryLocation && typeof primaryLocation === 'string' && primaryLocation.startsWith('custom-')) {
        setPrimaryLocation(null);
      }
    }
  };

  const showMapModal = (index = null) => {
    if (index !== null) {
      const loc = locations[index];
      setCurrentLocation({ ...loc, index });
      setMapCenter({
        lat: loc.coordinates[1],
        lng: loc.coordinates[0]
      });
    } else {
      setCurrentLocation({
        locationName: '',
        coordinates: [12.4922, 41.8902],
        radius: 100,
        index: null
      });
      setMapCenter(center);
    }
    setIsMapModalVisible(true);
  };

  const handleMapOk = () => {
    if (!currentLocation.locationName) {
      Swal.fire('Error!', 'Please enter a location name', 'error');
      return;
    }

    if (currentLocation.index !== undefined && currentLocation.index !== null) {
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
    
    if (primaryLocation === `custom-${index}`) {
      setPrimaryLocation(null);
    }
  };

  const onMapClick = (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    
    setCurrentLocation(prev => ({
      ...prev,
      coordinates: [lng, lat]
    }));
    
    setMapCenter({
      lat,
      lng
    });

    if (mapRef.current) {
      mapRef.current.panTo({ lat, lng });
    }
  };

  const handleMapLoad = (map) => {
    mapRef.current = map;
    setMapLoaded(true);
    setMapLoadError(false);
  };

  const handleScriptError = () => {
    setMapLoadError(true);
    Swal.fire('Error', 'Failed to load Google Maps. Please try again later.', 'error');
  };

  const handleSearch = (value) => {
    if (!window.google || !window.google.maps || !window.google.maps.places) {
      return;
    }

    const service = new window.google.maps.places.AutocompleteService();
    service.getPlacePredictions(
      {
        input: value,
        types: ['geocode'],
      },
      (predictions, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          setSearchResults(predictions || []);
        } else {
          setSearchResults([]);
        }
      }
    );
  };

  const handlePlaceSelect = (description) => {
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address: description }, (results, status) => {
      if (status === 'OK' && results[0]) {
        const location = results[0].geometry.location;
        const newCoords = [location.lng(), location.lat()];
        
        setCurrentLocation(prev => ({
          ...prev,
          coordinates: newCoords,
        }));
        
        setMapCenter({
          lat: location.lat(),
          lng: location.lng()
        });

        if (mapRef.current) {
          mapRef.current.panTo(location);
        }
      }
    });
  };

  const handleSubmit = async (values) => {
    if (!videoFile) {
      Swal.fire('Error!', 'Please select a video file', 'error');
      return;
    }

    try {
      setIsLoading(true);
      
      const formData = new FormData();
      formData.append('video', videoFile || videoFile);
      formData.append('title', values.title);
      formData.append('description', values.description);
      formData.append('language', values.language);
      formData.append('primaryLocation', values.primaryLocation);
      formData.append('duration', JSON.stringify(duration));
      
      if (thumbnailFile) {
        formData.append('image', thumbnailFile || thumbnailFile);
      }

      formData.append('geolocationSettings', JSON.stringify({
        isGeolocationEnabled,
        locations: locations.map(loc => ({
          type: 'Point',
          coordinates: loc.coordinates,
          radius: loc.radius,
          locationName: loc.locationName
        }))
      }));

      await uploadVideo(dispatch, formData);

      form.resetFields();
      setVideoFile(null);
      setThumbnailFile(null);
      setIsGeolocationEnabled(false);
      setLocations([]);
      setPrimaryLocation(null);

      Swal.fire('Success!', 'Video uploaded successfully!', 'success');
      navigate('/videos');
    } catch (error) {
      console.error('Error in video upload:', error);
      Swal.fire('Error!', error.message || 'Video upload failed. Please try again.', 'error');
    } finally {
      setIsLoading(false);
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
            <Option value="Deutsch">Deutsch</Option>
            <Option value="Italian">Italian</Option>
            <Option value="Arabic">Arabic</Option>
            <Option value="Chinese">Chinese</Option>
            <Option value="Japanese">Japanese</Option>
            <Option value="Korean">Korean</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Primary Location"
          name="primaryLocation"
          rules={[{ required: true, message: "Please select a primary location" }]}
        >
          <Select
            placeholder="Select a primary location"
            onChange={(value) => {
              setPrimaryLocation(value);
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

        {isGeolocationEnabled && (
          <Form.Item label="Allowed Locations">
            <div className="mb-4">
              {locations.map((loc, i) => (
                <div key={i} className="p-3 mb-2 border rounded flex justify-between items-center">
                  <div>
                    <strong>{loc.locationName || 'Unnamed Location'}</strong>
                    <div>Coordinates: {loc.coordinates[1].toFixed(6)}, {loc.coordinates[0].toFixed(6)}</div>
                    <div>Radius: {loc.radius} meters</div>
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

        <Form.Item
          label="Video File"
          required
          validateStatus={videoError ? "error" : ""}
          help={videoError}
        >
          <Upload
            beforeUpload={(file) => {
              const isValid = validateVideoFile(file);
              if (isValid) {
                setVideoFile(file);
              }
              return false;
            }}
            onChange={handleVideoChange}
            maxCount={1}
            accept=".mp4,.mov,.avi,.mkv"
            fileList={videoFile ? [videoFile] : []}
            onRemove={() => setVideoFile(null)}
          >
            <Button icon={<UploadOutlined />}>Select Video</Button>
          </Upload>
          {videoFile && (
            <div className="mt-2">
              Selected: {videoFile.name} ({(videoFile.size / (1024 * 1024)).toFixed(1)}MB)
            </div>
          )}
        </Form.Item>

        <Form.Item
          label="Thumbnail Image"
          validateStatus={thumbnailError ? "error" : ""}
          help={thumbnailError || ""}
        >
          <Upload
            beforeUpload={(file) => {
              const isImage = file.type.startsWith("image/");
              if (!isImage) {
                setThumbnailError("Only image files are allowed");
                return Upload.LIST_IGNORE;
              }
              setThumbnailError("");
              return false;
            }}
            onChange={handleThumbnailChange}
            maxCount={1}
            accept="image/*"
            fileList={thumbnailFile ? [thumbnailFile] : []}
            onRemove={() => setThumbnailFile(null)}
          >
            <Button icon={<UploadOutlined />}>Select Thumbnail</Button>
          </Upload>
        </Form.Item>

        {uploadProgress > 0 && uploadProgress < 100 && (
          <div className="mb-4">
            <Progress percent={uploadProgress} status="active" />
            <p className="text-sm text-gray-500">Uploading video...</p>
          </div>
        )}

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={isLoading}>
            Upload Video
          </Button>
        </Form.Item>
      </Form>

      <Modal
        title={currentLocation?.index !== undefined ? "Edit Location" : "Add New Location"}
        open={isMapModalVisible}
        onOk={handleMapOk}
        onCancel={handleMapCancel}
        width={800}
      >
        <Form layout="vertical">
          <Form.Item label="Location Name" required>
            <Input
              value={currentLocation?.locationName || ''}
              onChange={(e) => setCurrentLocation({ ...currentLocation, locationName: e.target.value })}
              placeholder="Enter location name"
            />
          </Form.Item>

          <Form.Item label="Search Location">
            <AutoComplete
              options={searchResults.map(result => ({
                value: result.description,
                label: result.description
              }))}
              onSelect={handlePlaceSelect}
              onSearch={handleSearch}
              placeholder="Search for a location"
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item label="Radius (meters)">
            <InputNumber
              min={0}
              max={100000}
              value={currentLocation?.radius}
              onChange={(value) => setCurrentLocation({ ...currentLocation, radius: value })}
            />
          </Form.Item>

          <Form.Item label="Coordinates">
            <div style={{ height: '400px', position: 'relative' }}>
              {mapLoadError ? (
                <div className="text-center p-10">
                  <p className="text-red-500">Failed to load map. Please refresh the page.</p>
                  <Button 
                    type="primary" 
                    onClick={() => window.location.reload()}
                    className="mt-4"
                  >
                    Reload Page
                  </Button>
                </div>
              ) : (
                <GoogleMap
                  mapContainerStyle={mapContainerStyle}
                  center={mapCenter}
                  zoom={12}
                  onClick={onMapClick}
                  onLoad={handleMapLoad}
                  options={{
                    streetViewControl: true,
                    mapTypeControl: true,
                    fullscreenControl: true,
                  }}
                >
                  {currentLocation?.coordinates && (
                    <MarkerF
                      position={{
                        lat: currentLocation.coordinates[1],
                        lng: currentLocation.coordinates[0]
                      }}
                    />
                  )}
                  {currentLocation?.coordinates && currentLocation?.radius && (
                    <CircleF
                      center={{
                        lat: currentLocation.coordinates[1],
                        lng: currentLocation.coordinates[0]
                      }}
                      radius={currentLocation.radius}
                      options={{
                        fillColor: "#4285F4",
                        fillOpacity: 0.2,
                        strokeColor: "#4285F4",
                        strokeOpacity: 0.8,
                        strokeWeight: 2,
                        clickable: false
                      }}
                    />
                  )}
                </GoogleMap>
              )}
            </div>
            <div className="mt-2 grid grid-cols-2 gap-4">
              <Form.Item label="Latitude">
                <InputNumber
                  style={{ width: '100%' }}
                  value={currentLocation?.coordinates?.[1]}
                  onChange={(value) => {
                    const newLat = parseFloat(value);
                    if (!isNaN(newLat)) {
                      const newCoords = [currentLocation.coordinates[0], newLat];
                      setCurrentLocation(prev => ({
                        ...prev,
                        coordinates: newCoords
                      }));
                      
                      const newCenter = { lat: newLat, lng: currentLocation.coordinates[0] };
                      setMapCenter(newCenter);
                      
                      if (mapRef.current) {
                        mapRef.current.panTo(newCenter);
                      }
                    }
                  }}
                  precision={6}
                  step={0.000001}
                />
              </Form.Item>
              <Form.Item label="Longitude">
                <InputNumber
                  style={{ width: '100%' }}
                  value={currentLocation?.coordinates?.[0]}
                  onChange={(value) => {
                    const newLng = parseFloat(value);
                    if (!isNaN(newLng)) {
                      const newCoords = [newLng, currentLocation.coordinates[1]];
                      setCurrentLocation(prev => ({
                        ...prev,
                        coordinates: newCoords
                      }));
                      
                      const newCenter = { lat: currentLocation.coordinates[1], lng: newLng };
                      setMapCenter(newCenter);
                      
                      if (mapRef.current) {
                        mapRef.current.panTo(newCenter);
                      }
                    }
                  }}
                  precision={6}
                  step={0.000001}
                />
              </Form.Item>
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