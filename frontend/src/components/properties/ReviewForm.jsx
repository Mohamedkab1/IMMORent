import React, { useState } from 'react';
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutline } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import { reviewService } from '../../services/reviews';

const ReviewForm = ({ propertyId, onReviewSubmitted }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast.warning('Veuillez sélectionner une note.');
      return;
    }
    
    if (comment.length < 5) {
      toast.warning('Votre commentaire doit faire au moins 5 caractères.');
      return;
    }

    setSubmitting(true);
    try {
      const response = await reviewService.submitReview({
        property_id: propertyId,
        rating,
        comment
      });

      if (response.success) {
        toast.success(response.message);
        setRating(0);
        setComment('');
        if (onReviewSubmitted) onReviewSubmitted();
      } else {
        toast.error(response.message || 'Erreur lors de la soumission de l\'avis.');
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Une erreur est survenue lors de la soumission.';
      toast.error(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-3xl border border-slate-200 dark:border-slate-800">
      <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Laisser un avis</h3>
      <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-xl border border-blue-100 dark:border-blue-800">
        Note : Votre avis sera soumis à une validation par notre équipe administrative avant d'être publié.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Votre note</label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className="transition-transform active:scale-90"
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
              >
                {(hoverRating || rating) >= star ? (
                  <StarIcon className={`w-8 h-8 ${hoverRating ? 'text-secondary/70' : 'text-secondary'}`} />
                ) : (
                  <StarOutline className="w-8 h-8 text-slate-300 dark:text-slate-700" />
                )}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Votre commentaire</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows="4"
            className="w-full p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all dark:text-white resize-none"
            placeholder="Partagez votre expérience sur ce bien..."
            required
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-4 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/20 hover:bg-primary-hover active:scale-95 transition-all disabled:opacity-50"
        >
          {submitting ? 'Envoi en cours...' : 'Publier mon avis'}
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;
