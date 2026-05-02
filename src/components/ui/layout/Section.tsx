import { ReactNode } from 'react';

export default function Section({
  title,
  children,
}: {
  title?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-4">
      {title && (
        <h2 className="text-white font-semibold text-lg">{title}</h2>
      )}
      {children}
    </div>
  );
}