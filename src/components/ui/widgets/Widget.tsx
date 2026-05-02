import type { ReactNode } from 'react';
import Card from '../components/Card';

interface WidgetProps {
  title?: string;
  action?: ReactNode;
  children: ReactNode;
}

export default function Widget({
  title,
  action,
  children,
}: WidgetProps) {
  return (
    <Card>
      {(title || action) && (
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-semibold text-white text-lg">
            {title}
          </h3>

          {action}
        </div>
      )}

      {children}
    </Card>
  );
}