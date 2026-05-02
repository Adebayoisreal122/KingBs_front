import { ReactNode } from 'react';
import { tokens } from '../system/tokens';

export default function Card({ children }: { children: ReactNode }) {
  return (
    <div className={`${tokens.color.bg.card} ${tokens.border.default} rounded-2xl p-6`}>
      {children}
    </div>
  );
}