import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css'; // Import du CSS global

import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/auth/PrivateRoute';
import Header from './components/common/Header';
import Footer from './components/common/Footer';

// Pages publiques
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Properties from './pages/Properties';
import PropertyDetail from './pages/PropertyDetail';
import Contact from './pages/Contact';
import LegalMentions from './pages/LegalMentions';
import CGV from './pages/CGV';
import Privacy from './pages/Privacy';
import About from './pages/About';
import NotFound from './pages/NotFound';

// Pages protégées
import NewRequest from './pages/NewRequest';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import AgentDashboard from './pages/AgentDashboard';
import ClientDashboard from './pages/ClientDashboard';
import Profile from './pages/Profile';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="app">
          <Header />
          <main className="main-content">
            <Routes>
              {/* Routes publiques */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/properties" element={<Properties />} />
              <Route path="/properties/:id" element={<PropertyDetail />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/mentions-legales" element={<LegalMentions />} />
              <Route path="/cgv" element={<CGV />} />
              <Route path="/confidentialite" element={<Privacy />} />
              <Route path="/about" element={<About />} />
              
              {/* Route pour les demandes de location (protégée - client uniquement) */}
              <Route path="/requests/new" element={
                <PrivateRoute requiredRole="client">
                  <NewRequest />
                </PrivateRoute>
              } />
              
              {/* Dashboard routes */}
              <Route path="/dashboard" element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              } />
              
              <Route path="/dashboard/admin" element={
                <PrivateRoute requiredRole="admin">
                  <AdminDashboard />
                </PrivateRoute>
              } />
              
              <Route path="/dashboard/agent" element={
                <PrivateRoute requiredRole="agent">
                  <AgentDashboard />
                </PrivateRoute>
              } />
              
              <Route path="/dashboard/client" element={
                <PrivateRoute requiredRole="client">
                  <ClientDashboard />
                </PrivateRoute>
              } />
              
              <Route path="/profile" element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              } />
              
              {/* Route 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
          <ToastContainer 
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;