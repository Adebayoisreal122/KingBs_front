import { ReactNode } from 'react';

export default function Button({
  children,
  onClick,
  variant = 'primary',
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'outline';
}) {
  return (
    <button
      onClick={onClick}
      className={
        variant === 'primary'
          ? 'bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-xl text-sm'
          : 'border border-white/10 text-gray-300 px-4 py-2 rounded-xl text-sm'
      }
    >
      {children}
    </button>
  );
}