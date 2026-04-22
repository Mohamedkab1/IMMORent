import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { requestService } from '../services/requests';
import { contractService } from '../services/contracts';
import { propertyService } from '../services/properties';
import { toast } from 'react-toastify';
import { 
  ArrowLeftIcon, 
  CalendarIcon, 
  CurrencyEuroIcon, 
  UserIcon, 
  HomeIcon, 
  MapPinIcon, 
  CheckCircleIcon, 
  KeyIcon, 
  TagIcon,
  DocumentTextIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const CreateContract = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [request, setRequest] = useState(null);
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [calculatedTotal, setCalculatedTotal] = useState(0);
  const [daysCount, setDaysCount] = useState(0);
  const [monthlyRate, setMonthlyRate] = useState(0);
  const [dailyRate, setDailyRate] = useState(0);
  
  const [formData, setFormData] = useState({
    rental_request_id: '',
    contract_type: '',
    start_date: '',
    end_date: '',
    sale_date: '',
    monthly_rent: '',
    sale_price: '',
    security_deposit: '',
    charges: ''
  });

  const queryParams = new URLSearchParams(location.search);
  const requestId = queryParams.get('request');

  useEffect(() => {
    if (!requestId) {
      toast.error('Aucune demande sélectionnée');
      navigate('/dashboard/agent');
      return;
    }
    fetchRequest();
  }, [requestId]);

  // Formater la date au format YYYY-MM-DD
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    // Si la date est au format ISO avec Z
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const fetchRequest = async () => {
    try {
      const res = await requestService.getById(requestId);
      if (res.success && res.data) {
        setRequest(res.data);
        const propertyRes = await propertyService.getById(res.data.property_id);
        if (propertyRes.success) {
          setProperty(propertyRes.data);
          
          // Calculer le taux journalier
          const monthlyPrice = propertyRes.data.price;
          setMonthlyRate(monthlyPrice);
          const dailyPrice = monthlyPrice / 30;
          setDailyRate(dailyPrice);
          
          // Formater les dates pour l'input date
          const startDate = formatDateForInput(res.data.start_date);
          const endDate = formatDateForInput(res.data.end_date);
          
          // Calculer le nombre de jours
          if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            const diffTime = Math.abs(end - start);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            setDaysCount(diffDays);
            
            // Calculer le montant total
            const total = dailyPrice * diffDays;
            setCalculatedTotal(total);
          }
          
          setFormData(prev => ({
            ...prev,
            rental_request_id: res.data.id,
            contract_type: propertyRes.data.transaction_type,
            start_date: startDate,
            end_date: endDate,
            monthly_rent: propertyRes.data.price,
            sale_price: propertyRes.data.price,
            security_deposit: propertyRes.data.price,
            sale_date: formatDateForInput(new Date().toISOString())
          }));
        }
      } else {
        toast.error('Demande non trouvée');
        navigate('/dashboard/agent');
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur de chargement');
      navigate('/dashboard/agent');
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Recalculer quand les dates changent
    if (name === 'start_date' || name === 'end_date') {
      const startDate = name === 'start_date' ? value : formData.start_date;
      const endDate = name === 'end_date' ? value : formData.end_date;
      
      if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        setDaysCount(diffDays);
        
        const total = dailyRate * diffDays;
        setCalculatedTotal(total);
      }
    }
  };

  const handleMonthlyRentChange = (e) => {
    const value = parseFloat(e.target.value) || 0;
    setMonthlyRate(value);
    setDailyRate(value / 30);
    setFormData(prev => ({ ...prev, monthly_rent: value }));
    
    // Recalculer le total
    if (formData.start_date && formData.end_date) {
      const total = (value / 30) * daysCount;
      setCalculatedTotal(total);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'monthly_rent') {
      handleMonthlyRentChange(e);
    } else if (name === 'start_date' || name === 'end_date') {
      handleDateChange(e);
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // Préparer les données à envoyer
      const submitData = {
        rental_request_id: parseInt(formData.rental_request_id),
        contract_type: formData.contract_type,
        start_date: formData.start_date || null,
        end_date: formData.end_date || null,
        sale_date: formData.sale_date || null,
        monthly_rent: parseFloat(formData.monthly_rent) || 0,
        sale_price: parseFloat(formData.sale_price) || 0,
        security_deposit: parseFloat(formData.security_deposit) || 0,
        charges: parseFloat(formData.charges) || 0
      };
      
      console.log('Données envoyées:', submitData);
      
      const res = await contractService.create(submitData);
      if (res.success) {
        toast.success(res.message);
        navigate(`/contracts/${res.data.id}`);
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      console.error('Erreur création contrat:', error);
      if (error.response?.data?.errors) {
        Object.values(error.response.data.errors).forEach(err => {
          toast.error(err[0]);
        });
      } else {
        toast.error(error.response?.data?.message || 'Erreur lors de la création');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="loading"><div className="spinner"></div><p>Chargement...</p></div>;
  if (!request || !property) return null;

  const isRent = property.transaction_type === 'rent';
  const contractTypeLabel = isRent ? 'Location' : 'Vente';
  const contractIcon = isRent ? <KeyIcon /> : <TagIcon />;
  
  // Formatage des dates pour l'affichage
  const formatDisplayDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <>
      <div className="create-contract-page">
        <div className="create-container">
          <button onClick={() => navigate(-1)} className="back-button">
            <ArrowLeftIcon className="back-icon" />
            Retour
          </button>
          <h1>Créer un contrat de {contractTypeLabel}</h1>
          
          <div className="contract-content">
            <div className="request-summary">
              <h2>
                <DocumentTextIcon className="section-icon" />
                Demande de {property.transaction_type === 'rent' ? 'location' : 'vente'}
              </h2>
              <div className="summary-card">
                <div className="summary-item">
                  <UserIcon className="summary-icon" />
                  <div>
                    <span className="summary-label">Client</span>
                    <p className="summary-value">{request.user?.name}</p>
                  </div>
                </div>
                <div className="summary-item">
                  <HomeIcon className="summary-icon" />
                  <div>
                    <span className="summary-label">Bien</span>
                    <p className="summary-value">{property.title}</p>
                    <p className="summary-address">{property.city} {property.postal_code}</p>
                  </div>
                </div>
                {isRent ? (
                  <>
                    <div className="summary-item">
                      <CalendarIcon className="summary-icon" />
                      <div>
                        <span className="summary-label">Période souhaitée par le client</span>
                        <p className="summary-value">
                          Du {formatDisplayDate(formData.start_date)} au {formatDisplayDate(formData.end_date)}
                        </p>
                        <p className="summary-detail">
                          <ClockIcon className="inline-icon" />
                          Durée: {daysCount} jour{daysCount > 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                    <div className="summary-item">
                      <CurrencyEuroIcon className="summary-icon" />
                      <div>
                        <span className="summary-label">Prix journalier estimé</span>
                        <p className="summary-value">{Math.round(dailyRate)}DH / jour</p>
                        <p className="summary-detail">(basé sur {monthlyRate}DH/mois ÷ 30 jours)</p>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="summary-item">
                    <CurrencyEuroIcon className="summary-icon" />
                    <div>
                      <span className="summary-label">Prix de vente</span>
                      <p className="summary-value">{property.price.toLocaleString()}DH</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="contract-form">
              <h2>
                <DocumentTextIcon className="section-icon" />
                Informations du contrat de {contractTypeLabel}
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="contract-type-badge">
                  {contractIcon}
                  <span>Contrat de {contractTypeLabel}</span>
                </div>

                {isRent ? (
                  <>
                    <div className="form-row">
                      <div className="form-group">
                        <label>
                          <CalendarIcon className="input-icon" />
                          Date de début *
                        </label>
                        <input 
                          type="date" 
                          name="start_date" 
                          value={formData.start_date} 
                          onChange={handleChange} 
                          required 
                        />
                        <small className="field-hint">
                          Date demandée par le client: {formatDisplayDate(request.start_date)}
                        </small>
                      </div>
                      <div className="form-group">
                        <label>
                          <CalendarIcon className="input-icon" />
                          Date de fin *
                        </label>
                        <input 
                          type="date" 
                          name="end_date" 
                          value={formData.end_date} 
                          onChange={handleChange} 
                          min={formData.start_date} 
                          required 
                        />
                        <small className="field-hint">
                          Date demandée par le client: {formatDisplayDate(request.end_date)}
                        </small>
                      </div>
                    </div>
                    
                    <div className="info-card">
                      <div className="info-row">
                        <span className="info-label">Durée du séjour:</span>
                        <span className="info-value"><strong>{daysCount}</strong> jour{daysCount > 1 ? 's' : ''}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">Tarif journalier:</span>
                        <span className="info-value">{Math.round(dailyRate)}DH / jour</span>
                      </div>
                      <div className="info-row total">
                        <span className="info-label">Montant total estimé:</span>
                        <span className="info-value total-amount">{Math.round(calculatedTotal).toLocaleString()}DH</span>
                      </div>
                    </div>
                    
                    <div className="form-row">
                      <div className="form-group">
                        <label>
                          <CurrencyEuroIcon className="input-icon" />
                          Loyer mensuel (base) *
                        </label>
                        <input 
                          type="number" 
                          name="monthly_rent" 
                          value={formData.monthly_rent} 
                          onChange={handleChange} 
                          required 
                        />
                      </div>
                      <div className="form-group">
                        <label>
                          <CurrencyEuroIcon className="input-icon" />
                          Dépôt de garantie *
                        </label>
                        <input 
                          type="number" 
                          name="security_deposit" 
                          value={formData.security_deposit} 
                          onChange={handleChange} 
                          required 
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="form-group">
                      <label>
                        <CalendarIcon className="input-icon" />
                        Date de vente *
                      </label>
                      <input 
                        type="date" 
                        name="sale_date" 
                        value={formData.sale_date} 
                        onChange={handleChange} 
                        required 
                      />
                    </div>
                    <div className="form-group">
                      <label>
                        <CurrencyEuroIcon className="input-icon" />
                        Prix de vente *
                      </label>
                      <input 
                        type="number" 
                        name="sale_price" 
                        value={formData.sale_price} 
                        onChange={handleChange} 
                        required 
                      />
                    </div>
                  </>
                )}

                <div className="form-group">
                  <label>
                    <CurrencyEuroIcon className="input-icon" />
                    Charges (optionnel)
                  </label>
                  <input type="number" name="charges" value={formData.charges} onChange={handleChange} />
                </div>

                <div className="info-box">
                  <CheckCircleIcon className="info-icon" />
                  <p>
                    {isRent 
                      ? `Le contrat de location sera établi pour une durée de ${daysCount} jours, du ${formatDisplayDate(formData.start_date)} au ${formatDisplayDate(formData.end_date)}. Montant total estimé: ${Math.round(calculatedTotal).toLocaleString()}DH.`
                      : `Le contrat de vente sera établi pour un montant de ${formData.sale_price?.toLocaleString()}DH.`
                    }
                  </p>
                </div>

                <div className="form-actions">
                  <button type="button" onClick={() => navigate(-1)} className="btn-cancel">
                    Annuler
                  </button>
                  <button type="submit" className="btn-submit" disabled={submitting}>
                    {submitting ? 'Création...' : `Créer le contrat de ${contractTypeLabel}`}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .create-contract-page {
          min-height: calc(100vh - 70px);
          background: #f8f9fa;
          padding: 2rem 1rem;
        }

        .create-container {
          max-width: 1000px;
          margin: 0 auto;
        }

        .back-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: none;
          border: none;
          color: #6b7280;
          cursor: pointer;
          margin-bottom: 1rem;
          font-size: 0.875rem;
        }

        .back-icon {
          width: 1rem;
          height: 1rem;
        }

        .back-button:hover {
          color: #d4af37;
        }

        h1 {
          font-size: 1.5rem;
          color: #0f2b4d;
          margin-bottom: 2rem;
        }

        .contract-content {
          display: grid;
          grid-template-columns: 1fr 1.5fr;
          gap: 2rem;
        }

        .request-summary,
        .contract-form {
          background: white;
          border-radius: 0.75rem;
          padding: 1.5rem;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .request-summary h2,
        .contract-form h2 {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1rem;
          color: #0f2b4d;
          margin-bottom: 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid #e5e7eb;
        }

        .section-icon {
          width: 1rem;
          height: 1rem;
          color: #d4af37;
        }

        .summary-card {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .summary-item {
          display: flex;
          gap: 0.75rem;
          align-items: flex-start;
        }

        .summary-icon {
          width: 1rem;
          height: 1rem;
          color: #d4af37;
          margin-top: 0.125rem;
        }

        .summary-label {
          display: block;
          font-size: 0.7rem;
          color: #6b7280;
          margin-bottom: 0.25rem;
        }

        .summary-value {
          font-weight: 500;
          color: #0f2b4d;
          margin: 0;
          font-size: 0.875rem;
        }

        .summary-address,
        .summary-detail {
          font-size: 0.7rem;
          color: #6b7280;
          margin: 0.25rem 0 0;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .inline-icon {
          width: 0.7rem;
          height: 0.7rem;
        }

        .contract-type-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: #d4af37;
          color: #0f2b4d;
          border-radius: 2rem;
          font-size: 0.75rem;
          font-weight: 600;
          margin-bottom: 1.5rem;
        }

        .contract-type-badge svg {
          width: 1rem;
          height: 1rem;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .form-group {
          margin-bottom: 1rem;
        }

        .form-group label {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-weight: 500;
          margin-bottom: 0.5rem;
          font-size: 0.875rem;
        }

        .input-icon {
          width: 0.875rem;
          height: 0.875rem;
          color: #6b7280;
        }

        .field-hint {
          display: block;
          font-size: 0.65rem;
          color: #9ca3af;
          margin-top: 0.25rem;
        }

        .form-group input {
          width: 100%;
          padding: 0.625rem;
          border: 1px solid #d1d5db;
          border-radius: 0.5rem;
          font-size: 0.875rem;
        }

        .form-group input:focus {
          outline: none;
          border-color: #d4af37;
        }

        .info-card {
          background: #f8f9fa;
          border-radius: 0.5rem;
          padding: 1rem;
          margin: 1rem 0;
        }

        .info-row {
          display: flex;
          justify-content: space-between;
          padding: 0.5rem 0;
          border-bottom: 1px solid #e5e7eb;
        }

        .info-row:last-child {
          border-bottom: none;
        }

        .info-row.total {
          margin-top: 0.5rem;
          padding-top: 0.5rem;
          border-top: 2px solid #d4af37;
          border-bottom: none;
        }

        .info-label {
          color: #6b7280;
          font-size: 0.75rem;
        }

        .info-value {
          color: #1f2937;
          font-weight: 500;
          font-size: 0.875rem;
        }

        .info-value.total-amount {
          color: #d4af37;
          font-size: 1rem;
          font-weight: 700;
        }

        .info-box {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem;
          background: #f0f9ff;
          border-radius: 0.5rem;
          margin: 1rem 0;
        }

        .info-icon {
          width: 1rem;
          height: 1rem;
          color: #10b981;
        }

        .info-box p {
          color: #0369a1;
          font-size: 0.75rem;
          margin: 0;
        }

        .form-actions {
          display: flex;
          gap: 1rem;
          margin-top: 1.5rem;
        }

        .btn-cancel,
        .btn-submit {
          flex: 1;
          padding: 0.75rem;
          border: none;
          border-radius: 0.5rem;
          font-weight: 600;
          cursor: pointer;
          font-size: 0.875rem;
        }

        .btn-cancel {
          background: #f3f4f6;
          color: #374151;
        }

        .btn-cancel:hover {
          background: #e5e7eb;
        }

        .btn-submit {
          background: #d4af37;
          color: #0f2b4d;
        }

        .btn-submit:hover:not(:disabled) {
          background: #c4a52e;
        }

        .btn-submit:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 50vh;
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
          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 768px) {
          .contract-content {
            grid-template-columns: 1fr;
          }
          .form-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
};

export default CreateContract;