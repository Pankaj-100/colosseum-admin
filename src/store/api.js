import axios from 'axios';
import axiosInstance from '../utils/axios';
import { loginError, setToken, setUser, startLogin } from './authSlice';
import { errorDashboard, fetchedDashboard, fetchingDashboard } from './dashboardSlice';
import { fetchingUser, fetchUserById, userError, userFetched } from './userSlice';
import Swal from 'sweetalert2';

import { 
  fetchedTerms, 
  fetchingTerms, 
  termsError,
  fetchedTermByLanguage,
  fetchedTermById,
  termDeleted,
  termSaved 
} from './termsConditionsSlice';

import {  
  fetchingVideos,
  fetchVideoById,
  fetchedVideos,
  videoError,
  startUpload,
  uploadComplete,
  resetUploadState 
} from './videoSlice';

import {
  fetchingLocations,
  fetchedLocations,
  locationError,
  locationDeleted,
  locationAdded,
  locationUpdated,
} from './locationSlice';

import {
  fetchingCodes,
  fetchedCodes,
  codeError,
  codeRevoked,
} from "./codeSlice";

// Auth functions
export const login = async (dispatch, admin) => {
  const { email, password } = admin;
  dispatch(startLogin());

  try {
    const { data } = await axiosInstance.post('api/admin/login', { email, password });
    dispatch(setUser(data));
    dispatch(setToken(data));
    localStorage.setItem('token', JSON.stringify(data.token));
    localStorage.setItem('admin', JSON.stringify(data.user));
    window.location.href = '/dashboard';
  } catch (error) {
    const errorMessage = error?.response?.data?.error?.message || 'Login failed';
    dispatch(loginError({ message: errorMessage }));
  }
};

// Dashboard functions
export const getDashboard = async (dispatch) => {
  try {
    dispatch(fetchingDashboard());
    const { data } = await axiosInstance.get('api/admin/getDashboardData');
    dispatch(fetchedDashboard(data));  
  } catch (error) {
    dispatch(errorDashboard(error?.response?.data));
  }
};

// User functions
export const getUsers = async (dispatch, search) => {
  try {
    dispatch(fetchingUser());
    const { data } = await axiosInstance.get(`api/admin/get_AllUsers?search=${search}`);
    dispatch(userFetched(data));
  } catch (error) {
    Swal.fire('Opps!', error?.response?.data?.message, 'error');
    dispatch(userError(error?.response?.data));
  }
};

export const getUserDetails = async (dispatch, id) => {
  try {
    dispatch(fetchingUser());
    const { data } = await axiosInstance(`api/admin/user_details/${id}`);
    dispatch(fetchUserById(data));
  } catch (error) {
    Swal.fire('Opps!', error?.response?.data?.message, 'error');
    dispatch(userError(error?.response?.data));
  }
};

// Video functions

export const uploadVideo = async (dispatch, formData) =>  {
  try {
    dispatch(startUpload());
    
    const { data } = await axiosInstance.post('api/video', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: (progressEvent) => {
        const progress = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        // Dispatch progress updates if needed
      }
    });

    Swal.fire('Success!', 'Video uploaded successfully', 'success');
    dispatch(uploadComplete());
    dispatch(resetUploadState());
    return data;
  } catch (error) {
    Swal.fire('Error!', error?.response?.data?.message, 'error');
    dispatch(videoError(error?.response?.data));
    throw error;
  }
};

export const getVideos = async (dispatch) => {
  try {
    dispatch(fetchingVideos());
    const { data } = await axiosInstance.get('api/video');
    console.log(data.data)
    dispatch(fetchedVideos(data));
  } catch (error) {
    Swal.fire('Error!', error?.response?.data?.message, 'error');
    dispatch(videoError(error?.response?.data));
  }
};

export const getVideoDetails = async (dispatch, id) => {
  try {
    const { data } = await axiosInstance.get(`api/video/${id}`);
    dispatch(fetchVideoById(data.data));
  } catch (error) {
    Swal.fire('Error!', error?.response?.data?.message || 'Failed to fetch video', 'error');
    dispatch(videoError(error?.response?.data?.message || 'Failed to fetch video'));
  }
};

export const saveVideoDetails = async (dispatch, videoData) => {
  try {
    const { data } = await axiosInstance.post('api/video/save', videoData);
    Swal.fire('Success!', 'Video details saved successfully', 'success');
    return data;
  } catch (error) {
    Swal.fire('Error!', error?.response?.data?.message, 'error');
    dispatch(videoError(error?.response?.data));
    throw error;
  }
};
export const updateVideoDetails = async (dispatch, id, formData) => {
  try {
    const { data } = await axiosInstance.put(`api/video/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return data;
  } catch (error) {
    throw error;
  }
};


export const getLocations = async (dispatch, search = "") => {
  try {
    dispatch(fetchingLocations());
    const { data } = await axiosInstance.get('api/location', {
      params: { search }
    });
    dispatch(fetchedLocations(data.locations));
  } catch (error) {
    Swal.fire('Error!', error?.response?.data?.message, 'error');
    dispatch(locationError(error?.response?.data));
  }
};

export const addLocation = async (dispatch, formData) => {
  try {
    const { data } = await axiosInstance.post('api/location', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    dispatch(locationAdded(data.data));
    Swal.fire('Success!', 'Location added successfully', 'success');
    return data;
  } catch (error) {
    Swal.fire('Error!', error?.response?.data?.message, 'error');
    dispatch(locationError(error?.response?.data));
    throw error;
  }
};

export const updateLocation = async (dispatch, id, formData) => {
  try {
    const { data } = await axiosInstance.put(`api/location/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    dispatch(locationUpdated(data.data));
    Swal.fire('Success!', 'Location updated successfully', 'success');
    return data;
  } catch (error) {
    Swal.fire('Error!', error?.response?.data?.message, 'error');
    dispatch(locationError(error?.response?.data));
    throw error;
  }
};

export const deleteLocation = async (dispatch, id) => {
  try {
    await axiosInstance.delete(`api/location/${id}`);
    dispatch(locationDeleted(id));
    Swal.fire('Success!', 'Location deleted successfully', 'success');
  } catch (error) {
    Swal.fire('Error!', error?.response?.data?.message, 'error');
    dispatch(locationError(error?.response?.data));
    throw error;
  }
};
// Code functions
export const getActiveCodes = async (dispatch, search = "") => {
  try {
    dispatch(fetchingCodes());
    const { data } = await axiosInstance.get(`api/code/active`);
    dispatch(fetchedCodes({ codes: data.codes, count: data.count }));
  } catch (error) {
    Swal.fire("Oops!", error?.response?.data?.message, "error");
    dispatch(codeError(error?.response?.data));
  }
};

export const generateCodes = async (dispatch, payload) => {
  try {
    dispatch(fetchingCodes());
    const { data } = await axiosInstance.post("api/code/generate", payload);
    Swal.fire("Success!", `${data.count} codes generated.`, "success");
    await getActiveCodes(dispatch);
  } catch (error) {
    Swal.fire("Oops!", error?.response?.data?.message, "error");
    dispatch(codeError(error?.response?.data));
  }
};

export const revokeCode = async (dispatch, plainCode) => {
  try {
    await axiosInstance.delete("api/code/revoke", {
      data: { plainCode },
    });
    dispatch(codeRevoked(plainCode));
    Swal.fire("Success!", "Code revoked.", "success");
  } catch (error) {
    Swal.fire("Oops!", error?.response?.data?.message, "error");
    dispatch(codeError(error?.response?.data));
  }
};

// Terms & Conditions functions
export const fetchAllTerms = async (dispatch) => {
  try {
    dispatch(fetchingTerms());
    const { data } = await axiosInstance.get('api/terms');
    dispatch(fetchedTerms(data));
  } catch (error) {
    Swal.fire('Error!', error?.response?.data?.message || 'Failed to fetch terms', 'error');
    dispatch(termsError(error?.response?.data));
  }
};

export const createTerm = async (termData, dispatch) => {
  try {
    dispatch(fetchingTerms());
    const { data } = await axiosInstance.post('api/terms', termData);
    
    if (!data.success) {
      throw new Error(data.message);
    }
    
    dispatch(termSaved(data.data));
    Swal.fire('Success!', 'Terms created successfully', 'success');
    return data.data;
  } catch (error) {
    Swal.fire('Error!', error.response.data.message || 'Failed to create terms', 'error');
    dispatch(termsError(error.response.data.message));
    throw error;
  }
};

export const getTermById = async (id, dispatch) => {
  try {
    dispatch(fetchingTerms());
    const { data } = await axiosInstance.get(`api/terms/${id}`);
    dispatch(fetchedTermById(data));
    return data;
  } catch (error) {
    Swal.fire('Error!', error?.response?.data?.message || 'Failed to fetch term', 'error');
    dispatch(termsError(error?.response?.data));
    throw error;
  }
};

export const updateTerm = async (id, termData, dispatch) => {
  try {
    dispatch(fetchingTerms());
    const { data } = await axiosInstance.put(`api/terms/${id}`, termData);
    dispatch(fetchedTermById(data));
    Swal.fire('Success!', 'Terms updated successfully', 'success');
    return data;
  } catch (error) {
    Swal.fire('Error!', error?.response?.data?.message || 'Failed to update terms', 'error');
    dispatch(termsError(error?.response?.data));
    throw error;
  }
};

export const deleteTerm = async (id, dispatch) => {
  try {
    dispatch(fetchingTerms());
    await axiosInstance.delete(`api/terms/${id}`);
    dispatch(termDeleted(id));
    Swal.fire('Success!', 'Terms deleted successfully', 'success');
  } catch (error) {
    Swal.fire('Error!', error?.response?.data?.message || 'Failed to delete terms', 'error');
    dispatch(termsError(error?.response?.data));
    throw error;
  }
};

export const getTermByLanguage = async (language, dispatch) => {
  try {
    dispatch(fetchingTerms());
    const { data } = await axiosInstance.get(`api/terms/language/${language}`);
    dispatch(fetchedTermByLanguage(data));
    return data;
  } catch (error) {
    Swal.fire('Error!', error?.response?.data?.message || 'Failed to fetch terms by language', 'error');
    dispatch(termsError(error?.response?.data));
    throw error;
  }
};

export const changePassword = async (dispatch, passwordData) => {
  try {
    const { data } = await axiosInstance.put('/api/admin/change-password', passwordData);
    Swal.fire('Success!', data.message || 'Password changed successfully.', 'success');
    return data;
  } catch (error) {
    Swal.fire('Oops!', error?.response?.data?.message || 'Password change failed', 'error');
    throw error;
  }
};