

import React from 'react';
import { SpinnerIcon } from './icons/SpinnerIcon.tsx';

interface LoadingOverlayProps {
  message: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ message }) => {
  return (
    <div className="fixed inset-0 bg-slate-900 bg-opacity-70 z-[100] flex flex-col justify-center items-center backdrop-blur-sm">
      <SpinnerIcon />
      <p className="mt-4 text-white text-lg font-semibold">{message}</p>
    </div>
  );
};