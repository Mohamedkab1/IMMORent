import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Context
import { AuthProvider } from './context/AuthContext';

// Components
import PrivateRoute from './components/auth/PrivateRoute';
import Header from './components/Common/Header';
import Footer from './components/Common/Footer';

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

// Pages protégées (biens)
import AddProperty from './pages/AddProperty';

// Pages protégées (demandes)
import NewRequest from './pages/NewRequest';

// Pages protégées (contrats)
import CreateContract from './pages/CreateContract';
import ContractDetail from './pages/ContractDetail';

// Pages protégées (dashboard)
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import AgentDashboard from './pages/AgentDashboard';
import ClientDashboard from './pages/ClientDashboard';

// Pages protégées (profil)
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

              {/* Routes protégées - Biens */}
              <Route 
                path="/properties/new" 
                element={
                  <PrivateRoute requiredRole="agent">
                    <AddProperty />
                  </PrivateRoute>
                } 
              />

              {/* Routes protégées - Demandes */}
              <Route 
                path="/requests/new" 
                element={
                  <PrivateRoute requiredRole="client">
                    <NewRequest />
                  </PrivateRoute>
                } 
              />

              {/* Routes protégées - Contrats */}
              <Route 
                path="/contracts/new" 
                element={
                  <PrivateRoute requiredRole="agent">
                    <CreateContract />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/contracts/:id" 
                element={
                  <PrivateRoute>
                    <ContractDetail />
                  </PrivateRoute>
                } 
              />

              {/* Routes protégées - Dashboard */}
              <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
              <Route path="/dashboard/admin" element={<PrivateRoute requiredRole="admin"><AdminDashboard /></PrivateRoute>} />
              <Route path="/dashboard/agent" element={<PrivateRoute requiredRole="agent"><AgentDashboard /></PrivateRoute>} />
              <Route path="/dashboard/client" element={<PrivateRoute requiredRole="client"><ClientDashboard /></PrivateRoute>} />

              {/* Routes protégées - Profil */}
              <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />

              {/* Route 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
          <ToastContainer position="top-right" autoClose={3000} />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;