import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { FavoritesProvider } from './context/FavoritesContext';
import ProtectedRoute from './components/Common/ProtectedRoute';
import Header from './components/Common/Header';
import Footer from './components/Common/Footer';
import Home from './pages/Home';
import Properties from './pages/Properties';
import Contact from './pages/Contact';
import About from './pages/About';
import Login from './pages/Login';
import Register from './pages/Register';
import RoleSelection from './pages/RoleSelection';
import Profile from './pages/Profile';
import LegalMentions from './pages/LegalMentions';
import Privacy from './pages/Privacy';
import CGV from './pages/CGV';
import PropertyDetail from './pages/PropertyDetail';
import ContractDetail from './pages/ContractDetail';
import NewRequest from './pages/NewRequest';
import EditProperty from './pages/EditProperty';
import ClientDashboard from './pages/ClientDashboard';
import AgentDashboard from './pages/AgentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AddProperty from './pages/AddProperty';
import Messages from './pages/Messages';
import CreateContract from './pages/CreateContract';
import Notifications from './pages/Notifications';
import Dashboard from './pages/Dashboard';
import Favorites from './pages/Favorites';
import Payment from './pages/Payment';
import PaymentsHistory from './pages/PaymentsHistory';
import ChatWidget from './components/Common/ChatWidget';
import PageLoader from './components/Common/PageLoader';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Component to handle layout and conditional rendering
const AppContent = () => {
  const { theme } = useTheme();
  const location = useLocation();
  const isAuthPage = ['/login', '/register', '/register/role'].includes(location.pathname);

  return (
    <div className="flex flex-col min-h-screen bg-bg-main text-text-main transition-colors duration-300">
      <Header />
      <main className={`flex-1 w-full animate-fade-in ${isAuthPage ? 'flex flex-col' : ''}`}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/properties" element={<Properties />} />
          <Route path="/properties/new" element={<ProtectedRoute requiredRole="agent"><AddProperty /></ProtectedRoute>} />
          <Route path="/properties/:id" element={<PropertyDetail />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/register/role" element={<RoleSelection />} />
          <Route path="/mentions-legales" element={<LegalMentions />} />
          <Route path="/confidentialite" element={<Privacy />} />
          <Route path="/cgv" element={<CGV />} />
          <Route path="/favoris" element={<Favorites />} />

          {/* Protected Routes - Any logged user */}
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/contracts/new" element={<ProtectedRoute requiredRole="agent"><CreateContract /></ProtectedRoute>} />
          <Route path="/contracts/:id" element={<ProtectedRoute><ContractDetail /></ProtectedRoute>} />
          <Route path="/requests/new" element={<ProtectedRoute><NewRequest /></ProtectedRoute>} />
          <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
          <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
          <Route path="/properties/:id/payment" element={<ProtectedRoute><Payment /></ProtectedRoute>} />
          <Route path="/payments/history" element={<ProtectedRoute><PaymentsHistory /></ProtectedRoute>} />
          
          {/* Dashboard Routes with specific roles */}
          <Route path="/dashboard/client" element={<ProtectedRoute requiredRole="client"><ClientDashboard /></ProtectedRoute>} />
          
          {/* Agent Routes */}
          <Route path="/dashboard/agent" element={<ProtectedRoute requiredRole="agent"><AgentDashboard /></ProtectedRoute>} />
          <Route path="/properties/edit/:id" element={<ProtectedRoute requiredRole="agent"><EditProperty /></ProtectedRoute>} />

          {/* Admin Routes */}
          <Route path="/dashboard/admin" element={<ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>} />
          <Route path="/dashboard/admin/users" element={<ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>} />
          <Route path="/dashboard/admin/properties" element={<ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>} />
          <Route path="/dashboard/admin/contracts" element={<ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>} />
          <Route path="/dashboard/admin/payments" element={<ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>} />
          <Route path="/dashboard/admin/requests" element={<ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>} />
          <Route path="/dashboard/admin/agent-requests" element={<ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/agent-requests" element={<ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>} />
          <Route path="/dashboard/admin/settings" element={<ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>} />
        </Routes>
      </main>
      <Footer />
      <ChatWidget />
      <PageLoader />
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={theme}
        toastClassName={() => 
          theme === 'light'
            ? `Toastify__toast flex items-center w-full cursor-pointer overflow-hidden mb-3`
            : `Toastify__toast relative flex p-1 min-h-10 rounded-lg justify-between overflow-hidden cursor-pointer shadow-huge border border-border-main glass-panel mb-4`
        }
        bodyClassName={() => 
          theme === 'light'
            ? "Toastify__toast-body flex items-center gap-3 w-full py-1"
            : "Toastify__toast-body flex text-xs font-black uppercase tracking-widest p-3"
        }
      />
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <FavoritesProvider>
            <Router>
              <AppContent />
            </Router>
          </FavoritesProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;