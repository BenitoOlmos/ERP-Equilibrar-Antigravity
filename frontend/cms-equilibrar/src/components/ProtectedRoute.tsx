import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
   allowedRoles?: string[];
   children?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles, children }) => {
   const { user, isLoading } = useAuth();
   const location = useLocation();

   if (isLoading) {
      return (
         <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="w-12 h-12 border-4 border-[#00A89C]/20 border-t-[#00A89C] rounded-full animate-spin" />
         </div>
      );
   }

   if (!user) {
      // Redirect to login but save the attempted location
      return <Navigate to="/login" state={{ from: location }} replace />;
   }

   if (allowedRoles && !allowedRoles.includes(user.role)) {
      // User is logged in but does not have the required role
      // Redirect to a safe fallback relative to their role
      if (user.role === 'SPECIALIST') return <Navigate to="/agenda" replace />;
      if (user.role === 'CLIENT') return <Navigate to="/mi-cuenta" replace />;
      return <Navigate to="/" replace />;
   }

   return children ? <>{children}</> : <Outlet />;
};
