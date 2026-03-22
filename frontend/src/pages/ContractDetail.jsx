import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { contractService } from '../services/contracts';
import { toast } from 'react-toastify';
import {
  ArrowLeftIcon,
  DocumentTextIcon,
  CalendarIcon,
  CurrencyEuroIcon,
  UserIcon,
  HomeIcon,
  MapPinIcon,
  BuildingOfficeIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const ContractDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin, isAgent } = useAuth();
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchContract();
  }, [id]);

  const fetchContract = async () => {
    try {
      const response = await contractService.getById(id);
      if (response.success && response.data) {
        setContract(response.data);
      } else {
        toast.error('Contrat non trouvé');
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors du chargement du contrat');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    if (!window.confirm(`Êtes-vous sûr de vouloir ${newStatus === 'terminated' ? 'résilier' : 'marquer comme expiré'} ce contrat ?`)) {
      return;
    }

    setUpdating(true);
    try {
      const response = await contractService.updateStatus(id, newStatus);
      if (response.success) {
        toast.success('Statut du contrat mis à jour');
        fetchContract();
      } else {
        toast.error(response.message || 'Erreur lors de la mise à jour');
      }
    } catch (error) {
      toast.error('Erreur lors de la mise à jour du statut');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { color: '#10b981', text: 'Actif', icon: CheckCircleIcon },
      terminated: { color: '#ef4444', text: 'Résilié', icon: ExclamationTriangleIcon },
      expired: { color: '#6b7280', text: 'Expiré', icon: ExclamationTriangleIcon }
    };
    const config = statusConfig[status] || statusConfig.active;
    const Icon = config.icon;
    
    return (
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px',
        padding: '5px 12px',
        background: config.color + '20',
        color: config.color,
        borderRadius: '20px',
        fontSize: '14px',
        fontWeight: '500'
      }}>
        <Icon className="h-4 w-4" />
        {config.text}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Chargement du contrat...</p>
      </div>
    );
  }

  if (!contract) {
    return null;
  }

  return (
    <div className="contract-detail-page">
      <div className="contract-detail-container">
        <div className="page-header">
          <button onClick={() => navigate(-1)} className="back-button">
            <ArrowLeftIcon className="h-5 w-5" />
            Retour
          </button>
          <div className="header-info">
            <h1>Contrat de location</h1>
            <p className="contract-number">N° {contract.contract_number}</p>
            {getStatusBadge(contract.status)}
          </div>
        </div>

        <div className="contract-detail-content">
          {/* Informations du bien */}
          <div className="info-section">
            <h2>
              <HomeIcon className="section-icon" />
              Informations du bien
            </h2>
            <div className="info-card">
              <h3>{contract.property?.title}</h3>
              <div className="property-address">
                <MapPinIcon className="h-4 w-4" />
                <span>{contract.property?.address}, {contract.property?.city} {contract.property?.postal_code}</span>
              </div>
              <div className="property-features">
                <span><BuildingOfficeIcon className="h-4 w-4" /> {contract.property?.surface} m²</span>
                <span><HomeIcon className="h-4 w-4" /> {contract.property?.rooms} pièces</span>
              </div>
            </div>
          </div>

          {/* Parties prenantes */}
          <div className="info-section">
            <h2>Parties prenantes</h2>
            <div className="parties-grid">
              <div className="party-card">
                <UserIcon className="party-icon" />
                <h3>Locataire</h3>
                <p className="party-name">{contract.tenant?.name}</p>
                <p className="party-contact">{contract.tenant?.email}</p>
                <p className="party-contact">{contract.tenant?.phone}</p>
              </div>
              <div className="party-card">
                <UserIcon className="party-icon" />
                <h3>Propriétaire</h3>
                <p className="party-name">{contract.owner?.name}</p>
                <p className="party-contact">{contract.owner?.email}</p>
                <p className="party-contact">{contract.owner?.phone}</p>
              </div>
              <div className="party-card">
                <UserIcon className="party-icon" />
                <h3>Agent immobilier</h3>
                <p className="party-name">{contract.agent?.name}</p>
                <p className="party-contact">{contract.agent?.email}</p>
                <p className="party-contact">{contract.agent?.phone}</p>
              </div>
            </div>
          </div>

          {/* Conditions financières */}
          <div className="info-section">
            <h2>
              <CurrencyEuroIcon className="section-icon" />
              Conditions financières
            </h2>
            <div className="financial-grid">
              <div className="financial-item">
                <span className="financial-label">Loyer mensuel</span>
                <span className="financial-value">{contract.monthly_rent?.toLocaleString('fr-FR')} €</span>
              </div>
              <div className="financial-item">
                <span className="financial-label">Charges mensuelles</span>
                <span className="financial-value">{contract.charges?.toLocaleString('fr-FR')} €</span>
              </div>
              <div className="financial-item">
                <span className="financial-label">Total mensuel</span>
                <span className="financial-value total">{(contract.monthly_rent + contract.charges).toLocaleString('fr-FR')} €</span>
              </div>
              <div className="financial-item">
                <span className="financial-label">Dépôt de garantie</span>
                <span className="financial-value">{contract.security_deposit?.toLocaleString('fr-FR')} €</span>
              </div>
            </div>
          </div>

          {/* Dates */}
          <div className="info-section">
            <h2>
              <CalendarIcon className="section-icon" />
              Période de location
            </h2>
            <div className="dates-grid">
              <div className="date-item">
                <span className="date-label">Date de début</span>
                <span className="date-value">{new Date(contract.start_date).toLocaleDateString('fr-FR')}</span>
              </div>
              <div className="date-item">
                <span className="date-label">Date de fin</span>
                <span className="date-value">{new Date(contract.end_date).toLocaleDateString('fr-FR')}</span>
              </div>
              <div className="date-item">
                <span className="date-label">Date de signature</span>
                <span className="date-value">{new Date(contract.signed_at).toLocaleDateString('fr-FR')}</span>
              </div>
            </div>
          </div>

          {/* Actions (si agent ou admin) */}
          {(isAgent || isAdmin) && contract.status === 'active' && (
            <div className="actions-section">
              <h2>Actions</h2>
              <div className="action-buttons">
                <button 
                  onClick={() => handleStatusChange('terminated')}
                  className="btn-terminate"
                  disabled={updating}
                >
                  Résilier le contrat
                </button>
                <button 
                  onClick={() => handleStatusChange('expired')}
                  className="btn-expire"
                  disabled={updating}
                >
                  Marquer comme expiré
                </button>
              </div>
            </div>
          )}

          {/* Note */}
          <div className="note-section">
            <p>
              Ce contrat a été généré automatiquement par la plateforme ImmoGest.
              Pour toute question, veuillez contacter votre agent immobilier.
            </p>
          </div>
        </div>
      </div>

      <style>{`
        .contract-detail-page {
          min-height: calc(100vh - 70px);
          background: #f8fafc;
          padding: 40px 20px;
        }

        .contract-detail-container {
          max-width: 900px;
          margin: 0 auto;
        }

        .page-header {
          margin-bottom: 30px;
        }

        .back-button {
          display: flex;
          align-items: center;
          gap: 8px;
          background: none;
          border: none;
          color: #6b7280;
          cursor: pointer;
          margin-bottom: 20px;
          font-size: 14px;
        }

        .back-button:hover {
          color: #2563eb;
        }

        .header-info {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 15px;
        }

        .header-info h1 {
          color: #1f2937;
          font-size: 28px;
          margin: 0;
        }

        .contract-number {
          color: #6b7280;
          font-size: 14px;
        }

        .contract-detail-content {
          display: flex;
          flex-direction: column;
          gap: 25px;
        }

        .info-section {
          background: white;
          border-radius: 10px;
          padding: 25px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .info-section h2 {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #1f2937;
          font-size: 18px;
          margin-bottom: 20px;
          padding-bottom: 10px;
          border-bottom: 1px solid #e5e7eb;
        }

        .section-icon {
          width: 20px;
          height: 20px;
          color: #2563eb;
        }

        .info-card h3 {
          color: #1f2937;
          font-size: 18px;
          margin-bottom: 10px;
        }

        .property-address {
          display: flex;
          align-items: center;
          gap: 5px;
          color: #6b7280;
          margin-bottom: 15px;
        }

        .property-features {
          display: flex;
          gap: 20px;
          color: #4b5563;
        }

        .property-features span {
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .parties-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }

        .party-card {
          background: #f9fafb;
          padding: 20px;
          border-radius: 8px;
          text-align: center;
        }

        .party-icon {
          width: 40px;
          height: 40px;
          margin: 0 auto 15px;
          color: #2563eb;
        }

        .party-card h3 {
          color: #1f2937;
          font-size: 16px;
          margin-bottom: 10px;
        }

        .party-name {
          color: #1f2937;
          font-weight: 500;
          margin-bottom: 5px;
        }

        .party-contact {
          color: #6b7280;
          font-size: 13px;
          margin: 5px 0;
        }

        .financial-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }

        .financial-item {
          display: flex;
          justify-content: space-between;
          padding: 12px;
          background: #f9fafb;
          border-radius: 5px;
        }

        .financial-label {
          color: #6b7280;
        }

        .financial-value {
          color: #1f2937;
          font-weight: 500;
        }

        .financial-value.total {
          color: #2563eb;
          font-size: 18px;
        }

        .dates-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }

        .date-item {
          text-align: center;
          padding: 15px;
          background: #f9fafb;
          border-radius: 5px;
        }

        .date-label {
          display: block;
          color: #6b7280;
          font-size: 13px;
          margin-bottom: 5px;
        }

        .date-value {
          display: block;
          color: #1f2937;
          font-weight: 500;
        }

        .actions-section {
          background: white;
          border-radius: 10px;
          padding: 25px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .actions-section h2 {
          color: #1f2937;
          font-size: 18px;
          margin-bottom: 20px;
        }

        .action-buttons {
          display: flex;
          gap: 15px;
        }

        .btn-terminate,
        .btn-expire {
          padding: 12px 24px;
          border: none;
          border-radius: 5px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
        }

        .btn-terminate {
          background: #fee2e2;
          color: #dc2626;
        }

        .btn-terminate:hover:not(:disabled) {
          background: #fecaca;
        }

        .btn-expire {
          background: #f3f4f6;
          color: #6b7280;
        }

        .btn-expire:hover:not(:disabled) {
          background: #e5e7eb;
        }

        button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .note-section {
          text-align: center;
          padding: 20px;
          color: #9ca3af;
          font-size: 12px;
        }

        @media (max-width: 768px) {
          .parties-grid {
            grid-template-columns: 1fr;
          }

          .financial-grid {
            grid-template-columns: 1fr;
          }

          .dates-grid {
            grid-template-columns: 1fr;
          }

          .action-buttons {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default ContractDetail;