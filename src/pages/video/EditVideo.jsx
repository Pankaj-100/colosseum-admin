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
  Radio,
  Upload,
  message,
} from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getVideoDetails, getUploadUrl } from "../../store/api";
import axiosInstance from "../../utils/axios";
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

// Google Maps configuration
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
    language: "English",
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
        language: video.language || "English",
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

  const handleThumbnailChange = async (info) => {
    if (info.file.status === "removed") {
      setThumbnailFile(null);
      setForm((prev) => ({ ...prev, thumbnailUrl: video.thumbnailUrl }));
      return;
    }

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

    try {
      setUploadingThumbnail(true);
      setThumbnailFile(file);

      // Get upload URL from backend
      const uploadData = await getUploadUrl(
        dispatch,
        file.name.split(".").pop()
      );

      // Upload the file to S3
      await fetch(uploadData.uploadURL, {
        method: "PUT",
        body: file,
      });

      // Clean up the URL (remove query parameters)
      const thumbnailUrl = new URL(uploadData.uploadURL);
      thumbnailUrl.search = "";
      const stringUrl = thumbnailUrl.toString();

      // Update form with new thumbnail URL
      setForm((prev) => ({ ...prev, thumbnailUrl: stringUrl }));
      message.success("Thumbnail uploaded successfully!");
    } catch (error) {
      console.error("Error uploading thumbnail:", error);
      message.error("Thumbnail upload failed.");
    } finally {
      setUploadingThumbnail(false);
    }
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

  async function updateVideo() {
    try {
      setLoading(true);

      const updatedData = {
        ...form,
        geolocationSettings: {
          isGeolocationEnabled,
          locations,
        },
      };

      const { data } = await axiosInstance.put(`api/video/${id}`, updatedData);
      if (data.success) {
        Swal.fire("Success!", "Video updated successfully", "success");
        return true;
      }
    } catch (error) {
      Swal.fire(
        "Error!",
        error.response?.data?.message || "Something went wrong",
        "error"
      );
      return false;
    } finally {
      setLoading(false);
    }
  }

  const [isModalOpen, setIsModalOpen] = useState(true);

  const handleOk = async () => {
    const success = await updateVideo();
    if (success) {
      setIsModalOpen(false);
      navigate("/videos");
    }
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
              <Option value="German">German</Option>
            </Select>
          </Form.Item>

     

          {isGeolocationEnabled && (
            <Form.Item label=" Locations">
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
                      {/* <Button
                        size="small"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => removeLocation(i)}
                      /> */}
                    </Space>
                  </div>
                ))}
              </div>
            </Form.Item>
          )}
        </Form>

        {/* Map Modal */}
        <Modal
          title={
            currentLocation?.index !== null
              ? "Edit Location"
              : "Add New Location"
          }
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
              <div className="mt-2">
                <p>
                  Latitude:{" "}
                  {currentLocation?.coordinates?.[1]?.toFixed(6) || "Not set"}
                </p>
                <p>
                  Longitude:{" "}
                  {currentLocation?.coordinates?.[0]?.toFixed(6) || "Not set"}
                </p>
              </div>
            </Form.Item>
          </Form>
        </Modal>
      </Modal>
    </Layout>
  );
}

export default EditVideo;
