import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LoadingScreen } from './LoadingScreen';

export const ProtectedRoute: React.FC = () => {
  const { token, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return (
      <LoadingScreen
        message="Authenticating Session..."
        submessage="Validating cryptographic bearer token with RetinaGuard authentication gateway"
      />
    );
  }

  return token ? <Outlet /> : <Navigate to="/login" replace />;
};
