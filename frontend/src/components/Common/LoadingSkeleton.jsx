import React from 'react';

const LoadingSkeleton = ({ type = 'card', count = 3 }) => {
  const skeletons = Array(count).fill(0);

  if (type === 'card') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {skeletons.map((_, i) => (
          <div key={i} className="bg-white dark:bg-slate-800 rounded-3xl p-4 shadow-sm border border-slate-100 dark:border-slate-700 animate-pulse">
            <div className="w-full h-48 bg-slate-200 dark:bg-slate-700 rounded-2xl mb-4"></div>
            <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded-lg w-3/4 mb-2"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-lg w-1/2 mb-4"></div>
            <div className="flex justify-between items-center">
              <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded-xl w-24"></div>
              <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded-xl w-20"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'stats') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {skeletons.map((_, i) => (
          <div key={i} className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 animate-pulse">
            <div className="flex justify-between items-start">
              <div className="space-y-3 flex-1">
                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-20"></div>
                <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-28"></div>
                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-16"></div>
              </div>
              <div className="w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-2xl"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'list') {
    return (
        <div className="space-y-4">
            {skeletons.map((_, i) => (
                <div key={i} className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 flex items-center gap-4 animate-pulse">
                    <div className="w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-xl"></div>
                    <div className="flex-1 space-y-2">
                        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/4"></div>
                        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
                    </div>
                </div>
            ))}
        </div>
    );
  }

  return null;
};

export default LoadingSkeleton;
