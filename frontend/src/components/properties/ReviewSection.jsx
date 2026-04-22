import React, { useState, useEffect } from 'react';
import ReviewList from './ReviewList';
import ReviewForm from './ReviewForm';
import { reviewService } from '../../services/reviews';
import { useAuth } from '../../context/AuthContext';
import { StarIcon, ChatBubbleBottomCenterTextIcon } from '@heroicons/react/24/outline';

const ReviewSection = ({ propertyId }) => {
  const { isAuthenticated, user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (propertyId) {
      loadReviews();
    }
  }, [propertyId]);

  const loadReviews = async () => {
    setLoading(true);
    try {
      const response = await reviewService.getPropertyReviews(propertyId);
      if (response.success) {
        setReviews(response.data);
      }
    } catch (error) {
      console.error('Error loading reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmitted = () => {
    // We don't necessarily reload reviews here because they are "pending"
    // But we could show a "thank you" or keep the form hidden
    setShowForm(false);
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary">
             <StarIcon className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-800 dark:text-white">Avis des clients</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Découvrez les expériences vécues dans ce bien.</p>
          </div>
        </div>

        {isAuthenticated && user?.role?.slug === 'client' && !showForm && (
          <button 
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-6 py-3 bg-secondary text-primary font-black rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-secondary/20"
          >
            <ChatBubbleBottomCenterTextIcon className="w-5 h-5" />
            Laisser un avis
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          {loading ? (
            <div className="flex justify-center py-10">
              <div className="w-10 h-10 border-4 border-slate-200 border-t-secondary rounded-full animate-spin"></div>
            </div>
          ) : (
            <ReviewList reviews={reviews} />
          )}
        </div>

        <div className="lg:col-span-1">
          {showForm ? (
            <ReviewForm propertyId={propertyId} onReviewSubmitted={handleReviewSubmitted} />
          ) : (
            <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm">
                <div className="flex items-center gap-2 text-primary dark:text-secondary mb-4">
                    <StarIcon className="w-6 h-6" />
                    <span className="font-black uppercase tracking-widest text-sm">Note moyenne</span>
                </div>
                <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-5xl font-black text-slate-800 dark:text-white">
                        {reviews.length > 0 
                            ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
                            : "0.0"}
                    </span>
                    <span className="text-slate-400 font-bold">/ 5</span>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Basé sur {reviews.length} avis validés</p>
                <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((n) => {
                        const count = reviews.filter(r => r.rating === n).length;
                        const percent = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                        return (
                            <div key={n} className="flex items-center gap-3">
                                <span className="text-xs font-bold text-slate-500 w-3">{n}</span>
                                <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                    <div className="h-full bg-secondary rounded-full" style={{ width: `${percent}%` }}></div>
                                </div>
                                <span className="text-[10px] font-black text-slate-400 w-6 text-right">{count}</span>
                            </div>
                        );
                    })}
                </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewSection;
