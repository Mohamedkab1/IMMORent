import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { contractService } from '../services/contracts';
import { toast } from 'react-toastify';
import { 
  ArrowLeftIcon, 
  HomeIcon, 
  CalendarIcon, 
  CurrencyEuroIcon, 
  UserIcon, 
  MapPinIcon, 
  BuildingOfficeIcon, 
  CheckCircleIcon, 
  ExclamationTriangleIcon, 
  ArrowDownTrayIcon,
  DocumentTextIcon,
  KeyIcon,
  TagIcon,
  DocumentDuplicateIcon
} from '@heroicons/react/24/outline';

const ContractDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin, isAgent } = useAuth();
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [downloading, setDownloading] = useState(false);

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

  const handleDownload = async () => {
    setDownloading(true);
    try {
      await contractService.download(id);
      toast.success('Téléchargement du contrat en cours...');
    } catch (error) {
      toast.error('Erreur lors du téléchargement');
    } finally {
      setDownloading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    const confirmMessage = newStatus === 'terminated' 
      ? 'Êtes-vous sûr de vouloir résilier ce contrat ?'
      : newStatus === 'completed'
      ? 'Êtes-vous sûr de vouloir marquer ce contrat comme terminé ?'
      : 'Êtes-vous sûr de vouloir marquer ce contrat comme expiré ?';
    
    if (!window.confirm(confirmMessage)) return;
    
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

  const getStatusBadge = (status, contractType) => {
    const statusConfig = {
      active: { bg: '#dcfce7', color: '#059669', text: contractType === 'rent' ? 'Actif' : 'En cours', icon: CheckCircleIcon },
      terminated: { bg: '#fee2e2', color: '#dc2626', text: 'Résilié', icon: ExclamationTriangleIcon },
      expired: { bg: '#f3f4f6', color: '#6b7280', text: 'Expiré', icon: ExclamationTriangleIcon },
      completed: { bg: '#dbeafe', color: '#2563eb', text: 'Terminé', icon: CheckCircleIcon }
    };
    const config = statusConfig[status] || statusConfig.active;
    const Icon = config.icon;
    
    return (
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.375rem',
        padding: '0.375rem 0.75rem',
        background: config.bg,
        color: config.color,
        borderRadius: '2rem',
        fontSize: '0.75rem',
        fontWeight: '500'
      }}>
        <Icon style={{ width: '0.875rem', height: '0.875rem' }} />
        {config.text}
      </span>
    );
  };

  const getContractTypeBadge = (type) => {
    if (type === 'rent') {
      return (
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.375rem',
          padding: '0.375rem 0.75rem',
          background: '#dcfce7',
          color: '#059669',
          borderRadius: '2rem',
          fontSize: '0.75rem',
          fontWeight: '500'
        }}>
          <KeyIcon style={{ width: '0.875rem', height: '0.875rem' }} />
          Contrat de location
        </span>
      );
    } else {
      return (
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.375rem',
          padding: '0.375rem 0.75rem',
          background: '#fee2e2',
          color: '#dc2626',
          borderRadius: '2rem',
          fontSize: '0.75rem',
          fontWeight: '500'
        }}>
          <TagIcon style={{ width: '0.875rem', height: '0.875rem' }} />
          Contrat de vente
        </span>
      );
    }
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

  const isRentContract = contract.contract_type === 'rent';
  const canManage = isAgent || isAdmin;

  return (
    <>
      <div className="contract-detail-page">
        <div className="detail-container">
          {/* Navigation */}
          <button onClick={() => navigate(-1)} className="back-button">
            <ArrowLeftIcon style={{ width: '1rem', height: '1rem' }} />
            Retour
          </button>

          {/* En-tête */}
          <div className="header">
            <div className="header-left">
              <h1>Contrat de {isRentContract ? 'location' : 'vente'}</h1>
              <p className="contract-number">N° {contract.contract_number}</p>
              <div className="badges">
                {getContractTypeBadge(contract.contract_type)}
                {getStatusBadge(contract.status, contract.contract_type)}
              </div>
            </div>
          </div>

          <div className="content">
            {/* Informations du bien */}
            <div className="info-card">
              <h2>
                <HomeIcon style={{ width: '1rem', height: '1rem' }} />
                Informations du bien
              </h2>
              <h3>{contract.property?.title}</h3>
              <p className="property-address">
                <MapPinIcon style={{ width: '0.875rem', height: '0.875rem' }} />
                {contract.property?.address}, {contract.property?.city} {contract.property?.postal_code}
              </p>
              <div className="property-features">
                <span><BuildingOfficeIcon style={{ width: '0.875rem', height: '0.875rem' }} /> {contract.property?.surface} m²</span>
                <span><HomeIcon style={{ width: '0.875rem', height: '0.875rem' }} /> {contract.property?.rooms} pièces</span>
                {contract.property?.bedrooms > 0 && (
                  <span><HomeIcon style={{ width: '0.875rem', height: '0.875rem' }} /> {contract.property?.bedrooms} chambres</span>
                )}
              </div>
            </div>

            {/* Parties prenantes */}
            <div className="info-card">
              <h2>
                <UserIcon style={{ width: '1rem', height: '1rem' }} />
                Parties prenantes
              </h2>
              <div className="parties-grid">
                {isRentContract ? (
                  <>
                    <div className="party-card">
                      <h4>Locataire</h4>
                      <p className="party-name">{contract.tenant?.name}</p>
                      <p className="party-contact">{contract.tenant?.email}</p>
                      <p className="party-contact">{contract.tenant?.phone}</p>
                    </div>
                    <div className="party-card">
                      <h4>Propriétaire</h4>
                      <p className="party-name">{contract.owner?.name}</p>
                      <p className="party-contact">{contract.owner?.email}</p>
                      <p className="party-contact">{contract.owner?.phone}</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="party-card">
                      <h4>Acheteur</h4>
                      <p className="party-name">{contract.buyer?.name}</p>
                      <p className="party-contact">{contract.buyer?.email}</p>
                      <p className="party-contact">{contract.buyer?.phone}</p>
                    </div>
                    <div className="party-card">
                      <h4>Vendeur</h4>
                      <p className="party-name">{contract.seller?.name}</p>
                      <p className="party-contact">{contract.seller?.email}</p>
                      <p className="party-contact">{contract.seller?.phone}</p>
                    </div>
                  </>
                )}
                <div className="party-card">
                  <h4>Agent immobilier</h4>
                  <p className="party-name">{contract.agent?.name}</p>
                  <p className="party-contact">{contract.agent?.email}</p>
                  <p className="party-contact">{contract.agent?.phone}</p>
                </div>
              </div>
            </div>

            {/* Conditions financières */}
            <div className="info-card">
              <h2>
                <CurrencyEuroIcon style={{ width: '1rem', height: '1rem' }} />
                Conditions {isRentContract ? 'financières' : 'de vente'}
              </h2>
              {isRentContract ? (
                <div className="financial-grid">
                  <div className="financial-item">
                    <span className="financial-label">Loyer mensuel</span>
                    <span className="financial-value">{contract.monthly_rent?.toLocaleString('fr-FR')} €</span>
                  </div>
                  <div className="financial-item">
                    <span className="financial-label">Charges mensuelles</span>
                    <span className="financial-value">{contract.charges?.toLocaleString('fr-FR')} €</span>
                  </div>
                  <div className="financial-item total">
                    <span className="financial-label">Total mensuel</span>
                    <span className="financial-value">{(contract.monthly_rent + (contract.charges || 0)).toLocaleString('fr-FR')} €</span>
                  </div>
                  <div className="financial-item">
                    <span className="financial-label">Dépôt de garantie</span>
                    <span className="financial-value">{contract.security_deposit?.toLocaleString('fr-FR')} €</span>
                  </div>
                </div>
              ) : (
                <div className="financial-grid">
                  <div className="financial-item">
                    <span className="financial-label">Prix de vente</span>
                    <span className="financial-value">{contract.sale_price?.toLocaleString('fr-FR')} €</span>
                  </div>
                  <div className="financial-item">
                    <span className="financial-label">Date de vente</span>
                    <span className="financial-value">{new Date(contract.sale_date).toLocaleDateString('fr-FR')}</span>
                  </div>
                  {contract.charges > 0 && (
                    <div className="financial-item">
                      <span className="financial-label">Frais annexes</span>
                      <span className="financial-value">{contract.charges?.toLocaleString('fr-FR')} €</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Période/Dates */}
            <div className="info-card">
              <h2>
                <CalendarIcon style={{ width: '1rem', height: '1rem' }} />
                {isRentContract ? 'Période de location' : 'Dates importantes'}
              </h2>
              <div className="dates-grid">
                {isRentContract ? (
                  <>
                    <div className="date-item">
                      <span className="date-label">Date de début</span>
                      <span className="date-value">{new Date(contract.start_date).toLocaleDateString('fr-FR')}</span>
                    </div>
                    <div className="date-item">
                      <span className="date-label">Date de fin</span>
                      <span className="date-value">{new Date(contract.end_date).toLocaleDateString('fr-FR')}</span>
                    </div>
                  </>
                ) : (
                  <div className="date-item full-width">
                    <span className="date-label">Date de signature</span>
                    <span className="date-value">{new Date(contract.signed_at).toLocaleDateString('fr-FR')}</span>
                  </div>
                )}
                <div className="date-item">
                  <span className="date-label">Date de signature</span>
                  <span className="date-value">{new Date(contract.signed_at).toLocaleDateString('fr-FR')}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="actions-card">
              <h2>Actions</h2>
              <div className="action-buttons">
                <button 
                  onClick={handleDownload}
                  className="btn-download"
                  disabled={downloading}
                >
                  <ArrowDownTrayIcon style={{ width: '1rem', height: '1rem' }} />
                  {downloading ? 'Téléchargement...' : 'Télécharger le contrat (PDF)'}
                </button>
                
                {canManage && contract.status === 'active' && (
                  <>
                    {isRentContract ? (
                      <>
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
                      </>
                    ) : (
                      <button 
                        onClick={() => handleStatusChange('completed')}
                        className="btn-complete"
                        disabled={updating}
                      >
                        Marquer comme terminé
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Note */}
            <div className="note-section">
              <p>
                Ce contrat a été généré automatiquement par la plateforme IMMORent.
                Pour toute question, veuillez contacter votre agent immobilier.
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .contract-detail-page {
          min-height: calc(100vh - 70px);
          background: #f8f9fa;
          padding: 2rem 1rem;
        }

        .detail-container {
          max-width: 900px;
          margin: 0 auto;
        }

        .back-button {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: none;
          border: none;
          color: #6b7280;
          cursor: pointer;
          font-size: 0.875rem;
          margin-bottom: 1.5rem;
          transition: color 0.3s;
        }

        .back-button:hover {
          color: #d4af37;
        }

        .header {
          margin-bottom: 2rem;
        }

        .header-left h1 {
          font-size: 1.5rem;
          color: #0f2b4d;
          margin-bottom: 0.25rem;
        }

        .contract-number {
          color: #6b7280;
          font-size: 0.875rem;
          margin-bottom: 1rem;
        }

        .badges {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .content {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .info-card {
          background: white;
          border-radius: 0.75rem;
          padding: 1.25rem;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .info-card h2 {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1rem;
          color: #0f2b4d;
          margin-bottom: 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid #e5e7eb;
        }

        .info-card h3 {
          font-size: 1rem;
          margin-bottom: 0.5rem;
          color: #0f2b4d;
        }

        .property-address {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          color: #6b7280;
          font-size: 0.875rem;
          margin-bottom: 0.75rem;
        }

        .property-features {
          display: flex;
          gap: 1rem;
          color: #4b5563;
          font-size: 0.75rem;
        }

        .property-features span {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .parties-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
        }

        .party-card {
          background: #f8f9fa;
          padding: 1rem;
          border-radius: 0.5rem;
        }

        .party-card h4 {
          font-size: 0.875rem;
          color: #0f2b4d;
          margin-bottom: 0.5rem;
        }

        .party-name {
          font-weight: 500;
          color: #1f2937;
          margin-bottom: 0.25rem;
          font-size: 0.875rem;
        }

        .party-contact {
          color: #6b7280;
          font-size: 0.75rem;
          margin: 0.125rem 0;
        }

        .financial-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }

        .financial-item {
          display: flex;
          justify-content: space-between;
          padding: 0.75rem;
          background: #f8f9fa;
          border-radius: 0.5rem;
        }

        .financial-item.total {
          background: #eff6ff;
        }

        .financial-item.total .financial-value {
          color: #2563eb;
          font-weight: 600;
        }

        .financial-label {
          color: #6b7280;
          font-size: 0.75rem;
        }

        .financial-value {
          color: #1f2937;
          font-weight: 500;
          font-size: 0.75rem;
        }

        .dates-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }

        .date-item {
          text-align: center;
          padding: 0.75rem;
          background: #f8f9fa;
          border-radius: 0.5rem;
        }

        .date-item.full-width {
          grid-column: span 2;
        }

        .date-label {
          display: block;
          color: #6b7280;
          font-size: 0.625rem;
          margin-bottom: 0.25rem;
        }

        .date-value {
          display: block;
          color: #1f2937;
          font-weight: 500;
          font-size: 0.875rem;
        }

        .actions-card {
          background: white;
          border-radius: 0.75rem;
          padding: 1.25rem;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .actions-card h2 {
          font-size: 1rem;
          color: #0f2b4d;
          margin-bottom: 1rem;
        }

        .action-buttons {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .btn-download,
        .btn-terminate,
        .btn-expire,
        .btn-complete {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.625rem 1.25rem;
          border: none;
          border-radius: 0.5rem;
          font-size: 0.75rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
        }

        .btn-download {
          background: #d4af37;
          color: #0f2b4d;
        }

        .btn-download:hover:not(:disabled) {
          background: #c4a52e;
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

        .btn-complete {
          background: #dbeafe;
          color: #2563eb;
        }

        .btn-complete:hover:not(:disabled) {
          background: #bfdbfe;
        }

        button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .note-section {
          text-align: center;
          padding: 1rem;
          color: #9ca3af;
          font-size: 0.75rem;
        }

        .loading-container {
          min-height: calc(100vh - 70px);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: #f8f9fa;
        }

        .spinner {
          width: 2rem;
          height: 2rem;
          border: 2px solid #e5e7eb;
          border-top-color: #d4af37;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 1rem;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
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

          .date-item.full-width {
            grid-column: span 1;
          }

          .action-buttons {
            flex-direction: column;
          }
        }
      `}</style>
    </>
  );
};

export default ContractDetail;