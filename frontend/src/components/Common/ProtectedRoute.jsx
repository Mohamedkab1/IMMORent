import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Not authenticated
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Role based protection
  if (requiredRole && user.role !== requiredRole && user.role?.slug !== requiredRole) {
    // If user has 'role.slug' instead of a simple string
    const userRoleValue = user.role?.slug || user.role;
    
    if (userRoleValue !== requiredRole) {
       // redirect based on user's actual role
       if (userRoleValue === 'admin') return <Navigate to="/dashboard/admin" replace />;
       if (userRoleValue === 'agent') return <Navigate to="/dashboard/agent" replace />;
       return <Navigate to="/dashboard/client" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
