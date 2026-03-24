import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  switch (user.role?.slug) {
    case 'admin': return <Navigate to="/dashboard/admin" replace />;
    case 'agent': return <Navigate to="/dashboard/agent" replace />;
    default: return <Navigate to="/dashboard/client" replace />;
  }
};

export default Dashboard;