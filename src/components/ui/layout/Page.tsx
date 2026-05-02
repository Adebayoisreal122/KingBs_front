import { ReactNode } from 'react';

export default function Page({ children }: { children: ReactNode }) {
  return <div className="min-h-screen bg-dark-900 text-white p-6">{children}</div>;
}