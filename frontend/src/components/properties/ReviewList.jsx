import React from 'react';
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutline } from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const ReviewList = ({ reviews }) => {
  if (!reviews || reviews.length === 0) {
    return (
      <div className="text-center py-10 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800">
        <p className="text-slate-500 dark:text-slate-400 font-medium tracking-wide">
          Aucun avis pour le moment. Soyez le premier à donner votre avis !
        </p>
      </div>
    );
  }

  const renderStars = (rating) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          star <= rating ? (
            <StarIcon key={star} className="w-4 h-4 text-secondary" />
          ) : (
            <StarOutline key={star} className="w-4 h-4 text-slate-300 dark:text-slate-600" />
          )
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div 
          key={review.id} 
          className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm transition-all hover:shadow-md"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center overflow-hidden border border-slate-200 dark:border-slate-600">
                {review.user?.profile_photo ? (
                  <img src={`/storage/${review.user.profile_photo}`} alt={review.user.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-slate-500 font-bold text-sm">{review.user?.name?.charAt(0)}</span>
                )}
              </div>
              <div>
                <h4 className="font-bold text-slate-800 dark:text-white text-sm">{review.user?.name}</h4>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-black">
                  {format(new Date(review.created_at), 'dd MMMM yyyy', { locale: fr })}
                </p>
              </div>
            </div>
            {renderStars(review.rating)}
          </div>
          
          <div className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed italic">
            "{review.comment}"
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReviewList;
