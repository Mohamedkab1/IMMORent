import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { contractService } from '../services/contracts';
import { toast } from 'react-toastify';
import { ArrowLeftIcon, HomeIcon, CalendarIcon, CurrencyEuroIcon, UserIcon, MapPinIcon, BuildingOfficeIcon, CheckCircleIcon, ExclamationTriangleIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';

const ContractDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin, isAgent } = useAuth();
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => { fetchContract(); }, [id]);

  const fetchContract = async () => {
    try {
      const res = await contractService.getById(id);
      if (res.success && res.data) setContract(res.data);
      else { toast.error('Contrat non trouvé'); navigate('/dashboard'); }
    } catch (error) { toast.error('Erreur'); navigate('/dashboard'); }
    finally { setLoading(false); }
  };

  const handleDownload = async () => {
    setDownloading(true);
    try {
      await contractService.download(id);
      toast.success('Téléchargement...');
    } catch (error) { toast.error('Erreur téléchargement'); }
    finally { setDownloading(false); }
  };

  const handleStatusChange = async (newStatus) => {
    if (!window.confirm(`Êtes-vous sûr de vouloir ${newStatus === 'terminated' ? 'résilier' : 'marquer comme expiré'} ce contrat ?`)) return;
    setUpdating(true);
    try {
      const res = await contractService.updateStatus(id, newStatus);
      if (res.success) { toast.success('Statut mis à jour'); fetchContract(); }
      else toast.error(res.message);
    } catch (error) { toast.error('Erreur'); }
    finally { setUpdating(false); }
  };

  const getStatusBadge = (status) => {
    const config = { active: { bg: '#dcfce7', color: '#059669', text: 'Actif' }, terminated: { bg: '#fee2e2', color: '#dc2626', text: 'Résilié' }, expired: { bg: '#f3f4f6', color: '#6b7280', text: 'Expiré' } };
    const c = config[status] || config.active;
    return <span style={{ background: c.bg, color: c.color, padding: '0.25rem 0.75rem', borderRadius: '2rem', fontSize: '0.75rem', fontWeight: 500 }}>{c.text}</span>;
  };

  if (loading) return <div className="loading"><div className="spinner"></div></div>;
  if (!contract) return null;

  return (
    <>
      <div className="contract-detail-page">
        <div className="detail-container">
          <button onClick={() => navigate(-1)} className="back-btn"><ArrowLeftIcon /> Retour</button>
          <div className="header"><h1>Contrat de location</h1><p>N° {contract.contract_number}</p>{getStatusBadge(contract.status)}</div>

          <div className="content">
            <div className="info-card"><h2><HomeIcon /> Informations du bien</h2><h3>{contract.property?.title}</h3><p><MapPinIcon /> {contract.property?.address}, {contract.property?.city} {contract.property?.postal_code}</p><p><BuildingOfficeIcon /> {contract.property?.surface} m² - {contract.property?.rooms} pièces</p></div>

            <div className="info-card"><h2><UserIcon /> Parties prenantes</h2><div className="parties"><div><h4>Locataire</h4><p>{contract.tenant?.name}</p><p>{contract.tenant?.email}</p><p>{contract.tenant?.phone}</p></div><div><h4>Propriétaire</h4><p>{contract.owner?.name}</p><p>{contract.owner?.email}</p><p>{contract.owner?.phone}</p></div><div><h4>Agent</h4><p>{contract.agent?.name}</p><p>{contract.agent?.email}</p><p>{contract.agent?.phone}</p></div></div></div>

            <div className="info-card"><h2><CurrencyEuroIcon /> Conditions financières</h2><div><span>Loyer mensuel</span><span>{contract.monthly_rent?.toLocaleString()} €</span></div><div><span>Charges</span><span>{contract.charges?.toLocaleString()} €</span></div><div className="total"><span>Total mensuel</span><span>{(contract.monthly_rent + contract.charges).toLocaleString()} €</span></div><div><span>Dépôt de garantie</span><span>{contract.security_deposit?.toLocaleString()} €</span></div></div>

            <div className="info-card"><h2><CalendarIcon /> Période de location</h2><div><span>Début</span><span>{new Date(contract.start_date).toLocaleDateString()}</span></div><div><span>Fin</span><span>{new Date(contract.end_date).toLocaleDateString()}</span></div><div><span>Signature</span><span>{new Date(contract.signed_at).toLocaleDateString()}</span></div></div>

            <div className="actions-card"><h2>Actions</h2><button onClick={handleDownload} className="btn-download" disabled={downloading}><ArrowDownTrayIcon /> {downloading ? 'Téléchargement...' : 'Télécharger le contrat (PDF)'}</button>
              {(isAgent || isAdmin) && contract.status === 'active' && <><button onClick={() => handleStatusChange('terminated')} className="btn-terminate">Résilier</button><button onClick={() => handleStatusChange('expired')} className="btn-expire">Expirer</button></>}</div>

            <div className="note">Ce contrat a été généré automatiquement par IMMORent.</div>
          </div>
        </div>
      </div>

      <style>{`
        .contract-detail-page { min-height: calc(100vh - 70px); background: #f8f9fa; padding: 2rem 1rem; }
        .detail-container { max-width: 900px; margin: 0 auto; }
        .back-btn { display: flex; align-items: center; gap: 0.5rem; background: none; border: none; color: #6b7280; cursor: pointer; margin-bottom: 1rem; }
        .back-btn:hover { color: #d4af37; }
        .header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem; }
        .header h1 { font-size: 1.5rem; color: #0f2b4d; margin: 0; }
        .header p { color: #6b7280; }
        .content { display: flex; flex-direction: column; gap: 1rem; }
        .info-card, .actions-card { background: white; border-radius: 0.75rem; padding: 1.5rem; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
        .info-card h2, .actions-card h2 { display: flex; align-items: center; gap: 0.5rem; font-size: 1rem; color: #0f2b4d; margin-bottom: 1rem; padding-bottom: 0.5rem; border-bottom: 1px solid #e5e7eb; }
        .info-card h2 svg { width: 1.25rem; height: 1.25rem; color: #d4af37; }
        .info-card h3 { font-size: 1rem; margin-bottom: 0.5rem; }
        .info-card p { display: flex; align-items: center; gap: 0.25rem; color: #6b7280; font-size: 0.875rem; margin-bottom: 0.5rem; }
        .parties { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; }
        .parties h4 { font-size: 0.875rem; color: #0f2b4d; margin-bottom: 0.5rem; }
        .parties p { margin-bottom: 0.25rem; font-size: 0.75rem; }
        .info-card > div { display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid #f3f4f6; }
        .info-card > div:last-child { border-bottom: none; }
        .total { font-weight: 600; color: #d4af37; }
        .actions-card { display: flex; flex-direction: column; gap: 1rem; }
        .btn-download, .btn-terminate, .btn-expire { display: flex; align-items: center; justify-content: center; gap: 0.5rem; padding: 0.75rem; border: none; border-radius: 0.5rem; font-weight: 600; cursor: pointer; }
        .btn-download { background: #10b981; color: white; }
        .btn-terminate { background: #fee2e2; color: #dc2626; }
        .btn-expire { background: #f3f4f6; color: #6b7280; }
        .note { text-align: center; font-size: 0.75rem; color: #9ca3af; }
        .loading { display: flex; justify-content: center; align-items: center; height: 50vh; }
        .spinner { width: 2rem; height: 2rem; border: 2px solid #e5e7eb; border-top-color: #d4af37; border-radius: 50%; animation: spin 1s linear infinite; }
        @media (max-width: 768px) { .parties { grid-template-columns: 1fr; } }
      `}</style>
    </>
  );
};

export default ContractDetail;