import React, { useState, useEffect } from 'react';
import { Input, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axiosInstance from '../../utils/axios';
import Spinner from '../../component/Spinner';
import Layout from '../../layout/Layout';

function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [touched, setTouched] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const user = localStorage.getItem('admin');
  const token = JSON.parse(localStorage.getItem('token'));

  useEffect(() => {
    if (!user) {
      navigate('/'); // Redirect if not logged in
    }
  }, [user]);

  const passwordError = touched && (!currentPassword || !newPassword || !confirmPassword);
  const passwordMismatch = touched && newPassword !== confirmPassword;

  const handleChangePassword = async () => {
    setTouched(true);

    if (!currentPassword || !newPassword || !confirmPassword || passwordMismatch) {
      return;
    }

    setLoading(true);
    try {
      await axiosInstance.put(
        '/api/auth/change-password',
        { currentPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      message.success('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTouched(false);
    } catch (error) {
      message.error(error?.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
    <div className="flex items-center justify-center bg-gradient-to-br from-gray-100 via-white to-gray-200 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-gray-800">Change Password</h1>
          <p className="text-sm text-gray-500 mt-1">Update your account credentials</p>
        </div>

        <div className="space-y-5">
          <div>
            <Input.Password
              placeholder="Current Password"
              size="large"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              status={touched && !currentPassword ? 'error' : ''}
            />
            {touched && !currentPassword && (
              <p className="text-red-500 text-xs mt-1">Current password is required</p>
            )}
          </div>

          <div>
            <Input.Password
              placeholder="New Password"
              size="large"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              status={touched && !newPassword ? 'error' : ''}
            />
            {touched && !newPassword && (
              <p className="text-red-500 text-xs mt-1">New password is required</p>
            )}
          </div>

          <div>
            <Input.Password
              placeholder="Confirm New Password"
              size="large"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              status={touched && (confirmPassword === '' || confirmPassword !== newPassword) ? 'error' : ''}
            />
            {touched && confirmPassword === '' && (
              <p className="text-red-500 text-xs mt-1">Please confirm your new password</p>
            )}
            {touched && confirmPassword && confirmPassword !== newPassword && (
              <p className="text-red-500 text-xs mt-1">Passwords do not match</p>
            )}
          </div>

          <button
            onClick={handleChangePassword}
            className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition duration-150 font-semibold text-sm"
            disabled={loading}
          >
            {loading ? <Spinner size={20} /> : 'Change Password'}
          </button>
        </div>
      </div>
    </div>
     </Layout>
  );
}

export default ChangePassword;
