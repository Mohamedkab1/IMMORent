import React, { useState, useEffect } from 'react';
import { reviewService } from '../../services/reviews';
import { toast } from 'react-toastify';
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  ClockIcon,
  ChatBubbleLeftRightIcon,
  UserIcon,
  HomeIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPendingReviews();
  }, []);

  const loadPendingReviews = async () => {
    setLoading(true);
    try {
      const response = await reviewService.getPendingReviews();
      if (response.success) {
        setReviews(response.data);
      }
    } catch (error) {
      toast.error('Erreur lors du chargement des avis en attente');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, status) => {
    try {
      const response = await reviewService.updateStatus(id, status);
      if (response.success) {
        toast.success(`Avis ${status === 'approved' ? 'approuvé' : 'rejeté'} avec succès`);
        setReviews(prev => prev.filter(r => r.id !== id));
      }
    } catch (error) {
      toast.error('Erreur lors du traitement de l\'avis');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-[var(--card-bg)] rounded-2xl border border-[var(--border-color)]">
        <div className="w-12 h-12 border-4 border-[var(--border-color)] border-t-primary rounded-full animate-spin mb-4"></div>
        <p className="text-[var(--text-muted)] font-bold uppercase tracking-widest text-xs">Chargement de la modération...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-[var(--text-main)] flex items-center gap-3">
          <ChatBubbleLeftRightIcon className="w-8 h-8 text-primary" />
          Modération des avis
        </h2>
        <span className="px-4 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-500 rounded-full text-xs font-black uppercase tracking-widest leading-none">
          {reviews.length} En attente
        </span>
      </div>

      {reviews.length === 0 ? (
        <div className="text-center py-20 bg-[var(--card-bg)] rounded-3xl border-2 border-dashed border-[var(--border-color)]">
           <CheckCircleIcon className="w-16 h-16 text-green-500/30 mx-auto mb-4" />
           <p className="text-[var(--text-muted)] font-bold uppercase tracking-widest text-sm">Tous les avis ont été modérés !</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {reviews.map((review) => (
            <div 
              key={review.id} 
              className="bg-[var(--card-bg)] p-6 rounded-3xl border border-[var(--border-color)] shadow-sm hover:shadow-md transition-all group"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex-1 space-y-4">
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2 px-3 py-1 bg-[var(--bg-muted)] rounded-full text-xs font-bold text-[var(--text-muted)]">
                      <UserIcon className="w-4 h-4" /> {review.user?.name}
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 bg-[var(--bg-muted)] rounded-full text-xs font-bold text-[var(--text-muted)]">
                      <HomeIcon className="w-4 h-4" /> {review.property?.title}
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 bg-[var(--bg-muted)] rounded-full text-xs font-bold text-[var(--text-muted)]">
                      <ClockIcon className="w-4 h-4" /> {format(new Date(review.created_at), 'dd/MM/yyyy HH:mm', { locale: fr })}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <StarIcon key={s} className={`w-5 h-5 ${s <= review.rating ? 'text-secondary fill-secondary' : 'text-[var(--border-color)]'}`} />
                    ))}
                    <span className="ms-2 font-black text-[var(--text-main)]">{review.rating}/5</span>
                  </div>

                  <p className="text-[var(--text-muted)] italic border-l-4 border-primary/20 ps-4 py-1 leading-relaxed">
                    "{review.comment}"
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleAction(review.id, 'approved')}
                    className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-2xl transition-all shadow-lg shadow-green-500/20 active:scale-95"
                  >
                    <CheckCircleIcon className="w-5 h-5" /> Approuver
                  </button>
                  <button 
                    onClick={() => handleAction(review.id, 'rejected')}
                    className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-2xl transition-all shadow-lg shadow-red-500/20 active:scale-95"
                  >
                    <XCircleIcon className="w-5 h-5" /> Rejeter
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminReviews;
