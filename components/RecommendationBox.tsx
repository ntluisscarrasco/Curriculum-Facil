

import React from 'react';
import { LightbulbIcon } from './icons/LightbulbIcon.js';

export const RecommendationBox: React.FC = () => {
  return (
    <div className="bg-gradient-to-br from-amber-300 to-orange-400 text-slate-800 p-4 rounded-lg shadow-lg mb-8" role="alert">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <LightbulbIcon className="h-10 w-10 text-yellow-600 mr-4 animate-pulse-slow" />
        </div>
        <div>
          <p className="font-bold text-lg text-black mb-1">Recomendación para tu CV</p>
          <p className="text-base text-slate-900">
            Un currículum debe ser conciso y fácil de leer. Lo ideal es que ocupe <b>una sola página</b>; solo extiéndelo a dos páginas si es absolutamente necesario.
          </p>
        </div>
      </div>
    </div>
  );
};