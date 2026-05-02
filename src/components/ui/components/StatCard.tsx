import Card from './Card';

export default function StatCard({
  label,
  value,
  icon,
  sub,
}: {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  sub?: string;
}) {
  return (
    <Card>
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-brand-500/15 flex items-center justify-center">
          {icon}
        </div>

        <div>
          <div className="text-3xl font-bold text-white">{value}</div>
          <div className="text-sm text-gray-400">{label}</div>
          {sub && <div className="text-xs text-gray-500">{sub}</div>}
        </div>
      </div>
    </Card>
  );
}