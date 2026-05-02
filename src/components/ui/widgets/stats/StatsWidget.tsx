import {
  Car,
  CheckCircle,
  XCircle,
  Tag,
} from 'lucide-react';

interface Props {
  stats: {
    total: number;
    available: number;
    sold: number;
    deals: number;
    featured: number;
    newCars: number;
    usedCars: number;
  };
}

const StatCard = ({
  label,
  value,
  icon,
  color,
  sub,
}: any) => (
  <div className="glass rounded-2xl p-5 border border-white/8">
    <div className="flex items-start gap-4">
      <div
        className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center`}
      >
        {icon}
      </div>

      <div>
        <div className="text-3xl font-black text-white">
          {value}
        </div>

        <div className="text-sm text-gray-300">
          {label}
        </div>

        {sub && (
          <div className="text-xs text-gray-500 mt-1">
            {sub}
          </div>
        )}
      </div>
    </div>
  </div>
);

export default function StatsWidget({ stats }: Props) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        label="Total Cars"
        value={stats.total}
        icon={<Car size={20} className="text-white" />}
        color="bg-blue-600"
        sub={`${stats.newCars} new · ${stats.usedCars} used`}
      />

      <StatCard
        label="Available"
        value={stats.available}
        icon={<CheckCircle size={20} className="text-white" />}
        color="bg-green-600"
        sub="Ready to sell"
      />

      <StatCard
        label="Sold"
        value={stats.sold}
        icon={<XCircle size={20} className="text-white" />}
        color="bg-gray-600"
        sub="Lifetime sales"
      />

      <StatCard
        label="Deals"
        value={stats.deals}
        icon={<Tag size={20} className="text-white" />}
        color="bg-brand-600"
        sub={`${stats.featured} featured`}
      />
    </div>
  );
}