import React, { useEffect, useState, useRef } from "react";
import Layout from "../../layout/Layout";
import {
  Image,
  Modal,
  Input,
  Select,
  Form,
  Button,
  Switch,
  InputNumber,
  Space,
  Upload,
  message,
} from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getVideoDetails, updateVideoDetails } from "../../store/api";
import Swal from "sweetalert2";
import {
  UploadOutlined,
  PlusOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import {
  LoadScript,
  GoogleMap,
  MarkerF,
  CircleF,
} from "@react-google-maps/api";

const { TextArea } = Input;
const { Option } = Select;

const mapContainerStyle = {
  width: "100%",
  height: "400px",
};

const center = {
  lat: 41.8902,
  lng: 12.4922,
};

function EditVideo() {
  const [loading, setLoading] = useState(false);
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);
  const { video } = useSelector((state) => state.video);
  const [form, setForm] = useState({
    title: "",
    description: "",
    language: "",
    thumbnailUrl: "",
    geolocationSettings: {
      isGeolocationEnabled: false,
      locations: [],
    },
  });
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [isGeolocationEnabled, setIsGeolocationEnabled] = useState(false);
  const [locations, setLocations] = useState([]);
  const [currentLocation, setCurrentLocation] = useState({
    locationName: "",
    coordinates: [12.4922, 41.8902],
    radius: 100,
    index: null,
  });
  const [isMapModalVisible, setIsMapModalVisible] = useState(false);
  const [mapCenter, setMapCenter] = useState(center);
  const mapRef = useRef(null);
  const dispatch = useDispatch();

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    getVideoDetails(dispatch, id);
  }, [dispatch, id]);

  useEffect(() => {
    if (video) {
      setForm({
        title: video.title || "",
        description: video.description || "",
        language: video.language || "select a language",
        thumbnailUrl: video.thumbnailUrl || "",
        geolocationSettings: video.geolocationSettings || {
          isGeolocationEnabled: false,
          locations: [],
        },
      });

      setIsGeolocationEnabled(
        video.geolocationSettings?.isGeolocationEnabled || false
      );
      setLocations(video.geolocationSettings?.locations || []);
    }
  }, [video]);

  const handleThumbnailChange = (info) => {


    const file = info.file;

    // Validate file type
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("You can only upload image files!");
      return;
    }

    // Validate file size (e.g., 5MB limit)
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error("Image must be smaller than 5MB!");
      return;
    }

    setThumbnailFile(file);
   
  };

  const handleGeolocationToggle = (checked) => {
    setIsGeolocationEnabled(checked);
    if (!checked) {
      setLocations([]);
    }
  };

  const showMapModal = (index = null) => {
    if (index !== null) {
      const loc = locations[index];
      setCurrentLocation({
        ...loc,
        index,
        coordinates: loc.coordinates,
      });
      setMapCenter({
        lat: loc.coordinates[1],
        lng: loc.coordinates[0],
      });
    } else {
      setCurrentLocation({
        locationName: "",
        coordinates: [12.4922, 41.8902],
        radius: 100,
        index: null,
      });
      setMapCenter(center);
    }
    setIsMapModalVisible(true);
  };

  const handleMapOk = () => {
    if (!currentLocation.locationName) {
      Swal.fire("Error!", "Please enter a location name", "error");
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
  };

  const removeLocation = (index) => {
    const newLocations = [...locations];
    newLocations.splice(index, 1);
    setLocations(newLocations);
  };

  const onMapClick = (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();

    setCurrentLocation((prev) => ({
      ...prev,
      coordinates: [lng, lat],
    }));

    setMapCenter({ lat, lng });

    if (mapRef.current) {
      mapRef.current.panTo({ lat, lng });
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('description', form.description);
      formData.append('language', form.language);
      
      if (thumbnailFile) {
        formData.append('image', thumbnailFile);
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

      await updateVideoDetails(dispatch, id, formData);

      Swal.fire("Success!", "Video updated successfully", "success");
      navigate("/videos");
    } catch (error) {
      Swal.fire(
        "Error!",
        error.response?.data?.message || "Something went wrong",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(true);

  const handleOk = async () => {
    await handleSubmit();
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    navigate("/videos");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Layout>
      <Modal
        title={loading ? "Loading..." : `Edit ${video?.title || "Video"}`}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        confirmLoading={loading}
        width={800}
      >
        <div className="flex flex-col items-center mb-4">
          <Image
            src={form.thumbnailUrl || video?.thumbnailUrl}
            alt="Video Thumbnail"
            width={200}
            preview={false}
            className="mb-2"
          />
          <Upload
            beforeUpload={() => false}
            onChange={handleThumbnailChange}
            maxCount={1}
            accept="image/*"
            showUploadList={false}
            disabled={uploadingThumbnail}
          >
            <Button icon={<UploadOutlined />} loading={uploadingThumbnail}>
              {uploadingThumbnail ? "Uploading..." : "Change Thumbnail"}
            </Button>
          </Upload>
          {thumbnailFile && (
            <div className="mt-2 text-sm text-gray-500">
              New thumbnail: {thumbnailFile.name}
            </div>
          )}
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
              onChange={(value) =>
                setForm((prev) => ({ ...prev, language: value }))
              }
            >
              <Option value="English">English</Option>
              <Option value="Spanish">Spanish</Option>
              <Option value="French">French</Option>
              <Option value="Deutsch">Deutsch</Option>
              <Option value="Italian">Italian</Option>
              <Option value="Arabic">Arabic</Option>
              <Option value="Chinese">Chinese</Option>
              <Option value="Japanese">Japanese</Option>
              <Option value="Korean">Korean</Option>
               <Option value="Portuguese">Portuguese</Option>
            <Option value="Russian">Russian</Option>
            <Option value="Hindi">Hindi</Option>
            </Select>
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
                  <div
                    key={i}
                    className="p-3 mb-2 border rounded flex justify-between items-center"
                  >
                    <div>
                      <strong>{loc.locationName || "Unnamed Location"}</strong>
                      <div>
                        Coordinates: {loc.coordinates[1]?.toFixed(6) || "N/A"},{" "}
                        {loc.coordinates[0]?.toFixed(6) || "N/A"}
                      </div>
                      <div>Radius: {loc.radius} meters</div>
                    </div>
                    <Space>
                      <Button
                        size="small"
                        type="primary"
                        onClick={() => showMapModal(i)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="small"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => removeLocation(i)}
                      />
                    </Space>
                  </div>
                ))}
              </div>
              <Button 
                type="dashed" 
                icon={<PlusOutlined />} 
                onClick={() => showMapModal()}
              >
                Add Location
              </Button>
            </Form.Item>
          )}
        </Form>

        {/* Map Modal */}
        <Modal
          title={currentLocation?.index !== null ? "Edit Location" : "Add New Location"}
          open={isMapModalVisible}
          onOk={handleMapOk}
          onCancel={() => setIsMapModalVisible(false)}
          width={800}
        >
          <Form layout="vertical">
            <Form.Item label="Location Name" required>
              <Input
                value={currentLocation?.locationName || ""}
                onChange={(e) =>
                  setCurrentLocation({
                    ...currentLocation,
                    locationName: e.target.value,
                  })
                }
                placeholder="Enter location name"
              />
            </Form.Item>

            <Form.Item label="Radius (meters)">
              <InputNumber
                min={0}
                max={100000}
                value={currentLocation?.radius}
                onChange={(value) =>
                  setCurrentLocation({ ...currentLocation, radius: value })
                }
              />
            </Form.Item>

            <Form.Item label="Coordinates">
              <div style={{ height: "400px", position: "relative" }}>
                <GoogleMap
                  mapContainerStyle={mapContainerStyle}
                  center={mapCenter}
                  zoom={12}
                  onClick={onMapClick}
                  onLoad={(map) => {
                    mapRef.current = map;
                  }}
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
                        lng: currentLocation.coordinates[0],
                      }}
                    />
                  )}

                  {currentLocation?.coordinates && currentLocation?.radius && (
                    <CircleF
                      center={{
                        lat: currentLocation.coordinates[1],
                        lng: currentLocation.coordinates[0],
                      }}
                      radius={currentLocation.radius}
                      options={{
                        fillColor: "#4285F4",
                        fillOpacity: 0.2,
                        strokeColor: "#4285F4",
                        strokeOpacity: 0.8,
                        strokeWeight: 2,
                        clickable: false,
                      }}
                    />
                  )}
                </GoogleMap>
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
      </Modal>
    </Layout>
  );
}

export default EditVideo;