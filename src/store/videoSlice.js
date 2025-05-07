import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  videos: [],
  video: null,
  loading: false,
  error: null,
  uploadProgress: 0,
  uploadUrl: null,
  uploadId: null,
  videoKey: null,
  totalVideos: 0,
};

const videoSlice = createSlice({
  name: "video",
  initialState,
  reducers: {
    // Fetching videos
    fetchingVideos: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchedVideos: (state, action) => {
      state.loading = false;
      state.videos = action.payload.data.videos;
      state.totalVideos = action.payload.totalVideos;
      state.error = null;
    },
    fetchVideoById: (state, action) => {
      state.loading = false;
      state.video = action.payload;
      state.error = null;
    },
    videoError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    resetVideoState: (state) => {
      state.video = null;
      state.error = null;
    },

    // Upload-related actions
    startUpload: (state) => {
      state.loading = true;
      state.uploadProgress = 0;
      state.error = null;
    },
    setUploadProgress: (state, action) => {
      state.uploadProgress = action.payload;
    },
    setUploadUrl: (state, action) => {
      state.uploadUrl = action.payload;
    },
    setUploadId: (state, action) => {
      state.uploadId = action.payload;
    },
    setVideoKey: (state, action) => {
      state.videoKey = action.payload;
    },
    uploadComplete: (state) => {
      state.loading = false;
      state.uploadProgress = 100;
    },
    resetUploadState: (state) => {
      state.uploadProgress = 0;
      state.uploadUrl = null;
      state.uploadId = null;
      state.videoKey = null;
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  fetchingVideos,
  fetchedVideos,
  fetchVideoById,
  videoError,
  resetVideoState,
  startUpload,
  setUploadProgress,
  setUploadUrl,
  setUploadId,
  setVideoKey,
  uploadComplete,
  resetUploadState,
} = videoSlice.actions;

export default videoSlice.reducer;
