import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  //const isAuthenticated = true;
  
  const isAuthenticated = useSelector((state) => state.user.isLoggedIn); 
  console.log('isAuthenticated:', isAuthenticated);
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
