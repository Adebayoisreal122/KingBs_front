import type { ReactNode } from 'react';

export default function WidgetGrid({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {children}
    </div>
  );
}