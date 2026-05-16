import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
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
  const { t } = useLanguage();
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
        toast.error(t('ctr.not_found', 'Contrat non trouvé'));
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error(t('ctr.load_error', 'Erreur lors du chargement du contrat'));
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    setDownloading(true);
    try {
      await contractService.download(id);
      toast.success(t('admin.contracts.downloading', 'Téléchargement du contrat en cours...'));
    } catch (error) {
      toast.error(t('ctr.download_error', 'Erreur lors du téléchargement'));
    } finally {
      setDownloading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    const confirmMessage = newStatus === 'terminated' 
      ? t('ctr.confirm_terminate', 'Êtes-vous sûr de vouloir résilier ce contrat ?')
      : newStatus === 'completed'
      ? t('ctr.confirm_complete', 'Êtes-vous sûr de vouloir marquer ce contrat comme terminé ?')
      : t('ctr.confirm_expire', 'Êtes-vous sûr de vouloir marquer ce contrat comme expiré ?');
    
    if (!window.confirm(confirmMessage)) return;
    
    setUpdating(true);
    try {
      const response = await contractService.updateStatus(id, newStatus);
      if (response.success) {
        toast.success(t('ctr.status_updated', 'Statut du contrat mis à jour'));
        fetchContract();
      } else {
        toast.error(response.message || t('ctr.update_error', 'Erreur lors de la mise à jour'));
      }
    } catch (error) {
      toast.error(t('ctr.status_error', 'Erreur lors de la mise à jour du statut'));
    } finally {
      setUpdating(false);
    }
  };

  const getStatusBadge = (status, contractType) => {
    const statusConfig = {
      active: { bg: 'bg-emerald-100 dark:bg-emerald-900/30', color: 'text-emerald-700 dark:text-emerald-400', text: contractType === 'rent' ? t('contract.status.active', 'Actif') : t('ctr.in_progress', 'En cours'), icon: CheckCircleIcon },
      terminated: { bg: 'bg-rose-100 dark:bg-rose-900/30', color: 'text-rose-700 dark:text-rose-400', text: t('contract.status.terminated', 'Résilié'), icon: ExclamationTriangleIcon },
      expired: { bg: 'bg-slate-100 dark:bg-slate-800', color: 'text-slate-500 dark:text-slate-400', text: t('contract.status.expired', 'Expiré'), icon: ExclamationTriangleIcon },
      completed: { bg: 'bg-blue-100 dark:bg-blue-900/30', color: 'text-blue-700 dark:text-blue-400', text: t('ctr.completed', 'Terminé'), icon: CheckCircleIcon }
    };
    const config = statusConfig[status] || statusConfig.active;
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${config.bg} ${config.color}`}>
        <Icon className="w-4 h-4" />
        {config.text}
      </span>
    );
  };

  const getContractTypeBadge = (type) => {
    if (type === 'rent') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400">
          <KeyIcon className="w-4 h-4" />
          {t('ctr.rental_contract', 'Contrat de location')}
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400">
          <TagIcon className="w-4 h-4" />
          {t('ctr.sale_contract', 'Contrat de vente')}
        </span>
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-soft flex flex-col justify-center items-center">
        <div className="w-16 h-16 border-4 border-bg-card border-t-primary rounded-full animate-spin mb-4"></div>
        <p className="text-text-muted font-medium">{t('common.loading', 'Chargement du contrat...')}</p>
      </div>
    );
  }

  if (!contract) {
    return null;
  }

  const isRentContract = contract.contract_type === 'rent';
  const canManage = isAgent || isAdmin;
  const hasPaid = contract.payments?.some(p => p.status === 'paid');

  return (
    <div className="min-h-screen bg-bg-soft transition-colors py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Navigation */}
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-text-sub hover:text-primary transition-colors font-medium">
          <ArrowLeftIcon className="w-4 h-4" />
          {t('common.prev', 'Retour')}
        </button>

        {/* En-tête */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-text-main tracking-tight mb-2">{isRentContract ? t('ctr.rental_contract', 'Contrat de location') : t('ctr.sale_contract', 'Contrat de vente')}</h1>
          <p className="text-text-sub font-medium mb-4">N° {contract.contract_number}</p>
          <div className="flex flex-wrap gap-3">
            {getContractTypeBadge(contract.contract_type)}
            {getStatusBadge(contract.status, contract.contract_type)}
          </div>
        </div>

        <div className="space-y-6">
          {/* Informations du bien */}
          <div className="bg-bg-card rounded-2xl md:rounded-3xl shadow-sm border border-border-main p-6 sm:p-8">
            <h2 className="text-lg font-bold text-text-main flex items-center gap-2 mb-6 pb-4 border-b border-border-main">
              <HomeIcon className="w-5 h-5 text-primary" />
              {t('ctr.property_info', 'Informations du bien')}
            </h2>
            <h3 className="font-bold text-text-main text-lg mb-2">{t(contract.property?.title, contract.property?.title)}</h3>
            <p className="flex items-center gap-1.5 text-text-sub font-medium text-sm mb-4">
              <MapPinIcon className="w-4 h-4" />
              {t(contract.property?.address, contract.property?.address)}, {t(contract.property?.city, contract.property?.city)} {contract.property?.postal_code}
            </p>
            <div className="flex flex-wrap gap-4 text-text-sub font-medium text-sm">
              <span className="flex items-center gap-1.5"><BuildingOfficeIcon className="w-4 h-4" /> {contract.property?.surface} {t('prop.surface_unit', 'm²')}</span>
              <span className="flex items-center gap-1.5"><HomeIcon className="w-4 h-4" /> {contract.property?.rooms} {t('prop.details.rooms', 'pièces')}</span>
              {contract.property?.bedrooms > 0 && (
                <span className="flex items-center gap-1.5"><HomeIcon className="w-4 h-4" /> {contract.property?.bedrooms} {t('prop.details.bedrooms', 'chambres')}</span>
              )}
            </div>
          </div>

          {/* Parties prenantes */}
          <div className="bg-bg-card rounded-2xl md:rounded-3xl shadow-sm border border-border-main p-6 sm:p-8">
            <h2 className="text-lg font-bold text-text-main flex items-center gap-2 mb-6 pb-4 border-b border-border-main">
              <UserIcon className="w-5 h-5 text-primary" />
              {t('ctr.stakeholders', 'Parties prenantes')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isRentContract ? (
                <>
                  <div className="bg-bg-soft rounded-2xl p-5 border border-border-main">
                    <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2">{t('admin.contracts.tenant', 'Locataire')}</h4>
                    <p className="font-bold text-text-main mb-1">{contract.tenant?.name}</p>
                    <p className="text-xs text-text-sub mb-1">{contract.tenant?.email}</p>
                    <p className="text-xs text-text-sub">{contract.tenant?.phone}</p>
                  </div>
                  <div className="bg-bg-soft rounded-2xl p-5 border border-border-main">
                    <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2">{t('admin.contracts.owner', 'Propriétaire')}</h4>
                    <p className="font-bold text-text-main mb-1">{contract.owner?.name}</p>
                    <p className="text-xs text-text-sub mb-1">{contract.owner?.email}</p>
                    <p className="text-xs text-text-sub">{contract.owner?.phone}</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="bg-bg-soft rounded-2xl p-5 border border-border-main">
                    <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2">{t('ctr.buyer', 'Acheteur')}</h4>
                    <p className="font-bold text-text-main mb-1">{contract.buyer?.name}</p>
                    <p className="text-xs text-text-sub mb-1">{contract.buyer?.email}</p>
                    <p className="text-xs text-text-sub">{contract.buyer?.phone}</p>
                  </div>
                  <div className="bg-bg-soft rounded-2xl p-5 border border-border-main">
                    <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2">{t('ctr.seller', 'Vendeur')}</h4>
                    <p className="font-bold text-text-main mb-1">{contract.seller?.name}</p>
                    <p className="text-xs text-text-sub mb-1">{contract.seller?.email}</p>
                    <p className="text-xs text-text-sub">{contract.seller?.phone}</p>
                  </div>
                </>
              )}
              <div className="bg-bg-soft rounded-2xl p-5 border border-border-main">
                <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2">{t('admin.users.role_agent', 'Agent immobilier')}</h4>
                <p className="font-bold text-text-main mb-1">{contract.agent?.name}</p>
                <p className="text-xs text-text-sub mb-1">{contract.agent?.email}</p>
                <p className="text-xs text-text-sub">{contract.agent?.phone}</p>
              </div>
            </div>
          </div>

          {/* Conditions financières */}
          <div className="bg-bg-card rounded-2xl md:rounded-3xl shadow-sm border border-border-main p-6 sm:p-8">
            <h2 className="text-lg font-bold text-text-main flex items-center gap-2 mb-6 pb-4 border-b border-border-main">
              <CurrencyEuroIcon className="w-5 h-5 text-primary" />
              {isRentContract ? t('ctr.financial_conditions', 'Conditions financières') : t('ctr.sale_conditions', 'Conditions de vente')}
            </h2>
            {isRentContract ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex justify-between items-center p-4 bg-bg-soft rounded-xl border border-border-main">
                  <span className="text-sm text-text-sub font-medium">{t('ctr.monthly_rent', 'Loyer mensuel')}</span>
                  <span className="font-bold text-text-main">{contract.monthly_rent?.toLocaleString('fr-FR')} DH</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-bg-soft rounded-xl border border-border-main">
                  <span className="text-sm text-text-sub font-medium">{t('ctr.monthly_charges', 'Charges mensuelles')}</span>
                  <span className="font-bold text-text-main">{contract.charges?.toLocaleString('fr-FR')} DH</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-primary/10 rounded-xl border border-primary/20 md:col-span-2">
                  <span className="text-sm font-bold text-primary">{t('ctr.monthly_total', 'Total mensuel')}</span>
                  <span className="font-black text-primary text-lg">{(contract.monthly_rent + (contract.charges || 0)).toLocaleString('fr-FR')} DH</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-bg-soft rounded-xl border border-border-main md:col-span-2">
                  <span className="text-sm text-text-sub font-medium">{t('ctr.security_deposit', 'Dépôt de garantie')}</span>
                  <span className="font-bold text-text-main">{contract.security_deposit?.toLocaleString('fr-FR')} DH</span>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex justify-between items-center p-4 bg-primary/10 rounded-xl border border-primary/20 md:col-span-2">
                  <span className="text-sm font-bold text-primary">{t('ctr.sale_price', 'Prix de vente')}</span>
                  <span className="font-black text-primary text-lg">{contract.sale_price?.toLocaleString('fr-FR')} DH</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-bg-soft rounded-xl border border-border-main">
                  <span className="text-sm text-text-sub font-medium">{t('ctr.sale_date', 'Date de vente')}</span>
                  <span className="font-bold text-text-main">{new Date(contract.sale_date).toLocaleDateString('fr-FR')}</span>
                </div>
                {contract.charges > 0 && (
                  <div className="flex justify-between items-center p-4 bg-bg-soft rounded-xl border border-border-main">
                    <span className="text-sm text-text-sub font-medium">{t('ctr.extra_fees', 'Frais annexes')}</span>
                    <span className="font-bold text-text-main">{contract.charges?.toLocaleString('fr-FR')} DH</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Période/Dates */}
          <div className="bg-bg-card rounded-2xl md:rounded-3xl shadow-sm border border-border-main p-6 sm:p-8">
            <h2 className="text-lg font-bold text-text-main flex items-center gap-2 mb-6 pb-4 border-b border-border-main">
              <CalendarIcon className="w-5 h-5 text-primary" />
              {isRentContract ? t('ctr.rental_period', 'Période de location') : t('ctr.important_dates', 'Dates importantes')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {isRentContract ? (
                <>
                  <div className="text-center p-4 bg-bg-soft rounded-xl border border-border-main">
                    <span className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1">{t('ctr.start_date', 'Date de début')}</span>
                    <span className="block font-bold text-text-main">{new Date(contract.start_date).toLocaleDateString('fr-FR')}</span>
                  </div>
                  <div className="text-center p-4 bg-bg-soft rounded-xl border border-border-main">
                    <span className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1">{t('ctr.end_date', 'Date de fin')}</span>
                    <span className="block font-bold text-text-main">{new Date(contract.end_date).toLocaleDateString('fr-FR')}</span>
                  </div>
                </>
              ) : (
                <div className="text-center p-4 bg-bg-soft rounded-xl border border-border-main md:col-span-2">
                  <span className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1">{t('ctr.sign_date', 'Date de signature')}</span>
                  <span className="block font-bold text-text-main">{new Date(contract.signed_at).toLocaleDateString('fr-FR')}</span>
                </div>
              )}
              {isRentContract && (
                <div className="text-center p-4 bg-bg-soft rounded-xl border border-border-main md:col-span-2">
                  <span className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1">{t('ctr.sign_date', 'Date de signature')}</span>
                  <span className="block font-bold text-text-main">{new Date(contract.signed_at).toLocaleDateString('fr-FR')}</span>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="bg-bg-card rounded-2xl md:rounded-3xl shadow-sm border border-border-main p-6 sm:p-8">
            <h2 className="text-lg font-bold text-text-main mb-6">{t('admin.prop.actions', 'Actions')}</h2>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={handleDownload}
                disabled={downloading}
                className="px-6 py-3 bg-primary !text-white hover:bg-primary-hover active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed rounded-xl font-bold shadow-md transition-all flex items-center gap-2"
              >
                <ArrowDownTrayIcon className="w-5 h-5" />
                {downloading ? t('ctr.downloading', 'Téléchargement...') : t('common.download_pdf', 'Télécharger (PDF)')}
              </button>

              {contract.status === 'active' && !hasPaid && !isAgent && !isAdmin && (
                <button 
                  onClick={() => navigate(`/properties/${contract.property_id}/payment`, { state: { property: contract.property, contract: contract, contractId: contract.id } })}
                  className="px-6 py-3 bg-green-600 !text-white hover:bg-green-700 active:scale-95 rounded-xl font-bold shadow-md transition-all flex items-center gap-2"
                >
                  <CurrencyEuroIcon className="w-5 h-5" />
                  {t('ctr.proceed_payment', 'Procéder au paiement')}
                </button>
              )}
              
              {canManage && contract.status === 'active' && (
                <>
                  {isRentContract ? (
                    <>
                      <button 
                        onClick={() => handleStatusChange('terminated')}
                        disabled={updating}
                        className="px-6 py-3 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 hover:bg-rose-100 dark:hover:bg-rose-900/40 rounded-xl font-bold transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        {t('ctr.terminate', 'Résilier le contrat')}
                      </button>
                      <button 
                        onClick={() => handleStatusChange('expired')}
                        disabled={updating}
                        className="px-6 py-3 bg-bg-soft text-text-main border border-border-main hover:bg-bg-card rounded-xl font-bold transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        {t('ctr.mark_expired', 'Marquer comme expiré')}
                      </button>
                    </>
                  ) : (
                    <button 
                      onClick={() => handleStatusChange('completed')}
                      disabled={updating}
                      className="px-6 py-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 rounded-xl font-bold transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {t('ctr.mark_completed', 'Marquer comme terminé')}
                    </button>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Note */}
          <p className="text-center text-xs font-medium text-text-muted p-4">
            {t('ctr.auto_generated', 'Ce contrat a été généré automatiquement par la plateforme IMMORent.')}
            {' '}{t('ctr.contact_agent', 'Pour toute question, veuillez contacter votre agent immobilier.')}
          </p>
        </div>
      </div>
    </div>

  );
};

export default ContractDetail;