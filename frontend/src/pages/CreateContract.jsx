import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { requestService } from '../services/requests';
import { contractService } from '../services/contracts';
import { propertyService } from '../services/properties';
import { toast } from 'react-toastify';
import { ArrowLeftIcon, CalendarIcon, CurrencyEuroIcon, UserIcon, HomeIcon, MapPinIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const CreateContract = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [request, setRequest] = useState(null);
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({ rental_request_id: '', start_date: '', end_date: '', monthly_rent: '', security_deposit: '', charges: '' });

  const queryParams = new URLSearchParams(location.search);
  const requestId = queryParams.get('request');

  useEffect(() => {
    if (!requestId) { toast.error('Aucune demande'); navigate('/dashboard/agent'); return; }
    fetchRequest();
  }, [requestId]);

  const fetchRequest = async () => {
    try {
      const res = await requestService.getById(requestId);
      if (res.success && res.data) {
        setRequest(res.data);
        const formatDate = (d) => new Date(d).toISOString().split('T')[0];
        setFormData({ rental_request_id: res.data.id, start_date: formatDate(res.data.start_date), end_date: formatDate(res.data.end_date), monthly_rent: res.data.property?.price || '', security_deposit: res.data.property?.price || '', charges: '' });
        if (res.data.property_id) {
          const propRes = await propertyService.getById(res.data.property_id);
          if (propRes.success) setProperty(propRes.data);
        }
      } else { toast.error('Demande non trouvée'); navigate('/dashboard/agent'); }
    } catch (error) { toast.error('Erreur'); navigate('/dashboard/agent'); }
    finally { setLoading(false); }
  };

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await contractService.create(formData);
      if (res.success) { toast.success('Contrat créé !'); navigate(`/contracts/${res.data.id}`); }
      else toast.error(res.message);
    } catch (error) { toast.error('Erreur création'); }
    finally { setSubmitting(false); }
  };

  if (loading) return <div className="loading"><div className="spinner"></div></div>;
  if (!request || !property) return null;

  return (
    <>
      <div className="create-contract-page">
        <div className="create-container">
          <button onClick={() => navigate(-1)} className="back-btn"><ArrowLeftIcon /> Retour</button>
          <h1>Créer un contrat de location</h1>
          <div className="contract-content">
            <div className="request-summary">
              <h2>Demande de location</h2>
              <div className="summary-card">
                <div><UserIcon /><div><span>Client</span><p>{request.user?.name}</p></div></div>
                <div><HomeIcon /><div><span>Bien</span><p>{property.title}</p><p className="address">{property.city} {property.postal_code}</p></div></div>
                <div><CalendarIcon /><div><span>Période</span><p>{new Date(request.start_date).toLocaleDateString()} - {new Date(request.end_date).toLocaleDateString()}</p></div></div>
              </div>
            </div>
            <div className="contract-form">
              <h2>Informations du contrat</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-row"><div className="form-group"><label><CalendarIcon /> Date début *</label><input type="date" name="start_date" value={formData.start_date} onChange={handleChange} required /></div>
                <div className="form-group"><label><CalendarIcon /> Date fin *</label><input type="date" name="end_date" value={formData.end_date} onChange={handleChange} min={formData.start_date} required /></div></div>
                <div className="form-row"><div className="form-group"><label><CurrencyEuroIcon /> Loyer mensuel *</label><input type="number" name="monthly_rent" value={formData.monthly_rent} onChange={handleChange} required /></div>
                <div className="form-group"><label><CurrencyEuroIcon /> Dépôt de garantie *</label><input type="number" name="security_deposit" value={formData.security_deposit} onChange={handleChange} required /></div></div>
                <div className="form-group"><label><CurrencyEuroIcon /> Charges mensuelles</label><input type="number" name="charges" value={formData.charges} onChange={handleChange} /></div>
                <div className="info"><CheckCircleIcon /><p>Le bien sera marqué comme "Loué" après création du contrat.</p></div>
                <div className="form-actions"><button type="button" onClick={() => navigate(-1)} className="btn-cancel">Annuler</button><button type="submit" className="btn-submit" disabled={submitting}>{submitting ? 'Création...' : 'Créer le contrat'}</button></div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .create-contract-page { min-height: calc(100vh - 70px); background: #f8f9fa; padding: 2rem 1rem; }
        .create-container { max-width: 1000px; margin: 0 auto; }
        .back-btn { display: flex; align-items: center; gap: 0.5rem; background: none; border: none; color: #6b7280; cursor: pointer; margin-bottom: 1rem; }
        .back-btn:hover { color: #d4af37; }
        h1 { font-size: 1.75rem; color: #0f2b4d; margin-bottom: 2rem; }
        .contract-content { display: grid; grid-template-columns: 1fr 1.5fr; gap: 2rem; }
        .request-summary, .contract-form { background: white; border-radius: 0.75rem; padding: 1.5rem; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
        .request-summary h2, .contract-form h2 { font-size: 1.125rem; color: #0f2b4d; margin-bottom: 1rem; padding-bottom: 0.5rem; border-bottom: 1px solid #e5e7eb; }
        .summary-card { display: flex; flex-direction: column; gap: 1rem; }
        .summary-card > div { display: flex; gap: 1rem; }
        .summary-card svg { width: 1.25rem; height: 1.25rem; color: #d4af37; }
        .summary-card span { display: block; font-size: 0.75rem; color: #6b7280; }
        .summary-card p { font-weight: 500; color: #0f2b4d; margin: 0; }
        .address { font-size: 0.75rem; font-weight: normal; color: #6b7280; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem; }
        .form-group { margin-bottom: 1rem; }
        .form-group label { display: flex; align-items: center; gap: 0.25rem; font-weight: 500; margin-bottom: 0.5rem; font-size: 0.875rem; }
        .form-group input { width: 100%; padding: 0.625rem; border: 1px solid #d1d5db; border-radius: 0.5rem; }
        .info { display: flex; align-items: center; gap: 0.5rem; padding: 0.75rem; background: #f0f9ff; border-radius: 0.5rem; margin: 1rem 0; }
        .info p { color: #0369a1; font-size: 0.75rem; margin: 0; }
        .form-actions { display: flex; gap: 1rem; margin-top: 1.5rem; }
        .btn-cancel, .btn-submit { flex: 1; padding: 0.75rem; border: none; border-radius: 0.5rem; font-weight: 600; cursor: pointer; }
        .btn-cancel { background: #f3f4f6; color: #374151; }
        .btn-submit { background: #d4af37; color: #0f2b4d; }
        .loading { display: flex; justify-content: center; align-items: center; height: 50vh; }
        .spinner { width: 2rem; height: 2rem; border: 2px solid #e5e7eb; border-top-color: #d4af37; border-radius: 50%; animation: spin 1s linear infinite; }
        @media (max-width: 768px) { .contract-content { grid-template-columns: 1fr; } .form-row { grid-template-columns: 1fr; } }
      `}</style>
    </>
  );
};

export default CreateContract;