import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/Common/ProtectedRoute';
import Header from './components/Common/Header';
import Footer from './components/Common/Footer';
import Home from './pages/Home';
import Properties from './pages/Properties';
import Contact from './pages/Contact';
import About from './pages/About';
import Login from './pages/Login';
import Register from './pages/Register';
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
import Dashboard from './pages/Dashboard';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <Router>
            <div className="flex flex-col min-h-screen bg-bg-main text-text-main transition-colors duration-300">
              <Header />
              <main className="flex-1 w-full animate-fade-in">
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
                  <Route path="/mentions-legales" element={<LegalMentions />} />
                  <Route path="/confidentialite" element={<Privacy />} />
                  <Route path="/cgv" element={<CGV />} />

                  {/* Protected Routes - Any logged user */}
                  <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                  <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                  <Route path="/contracts/new" element={<ProtectedRoute requiredRole="agent"><CreateContract /></ProtectedRoute>} />
                  <Route path="/contracts/:id" element={<ProtectedRoute><ContractDetail /></ProtectedRoute>} />
                  <Route path="/requests/new" element={<ProtectedRoute><NewRequest /></ProtectedRoute>} />
                  <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
                  
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
            </div>
            <ToastContainer 
              position="top-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="colored"
            />
          </Router>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;