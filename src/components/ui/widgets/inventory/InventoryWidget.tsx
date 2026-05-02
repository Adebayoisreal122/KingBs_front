import Widget from '../Widget';
import type { Car } from '@types';

export default function InventoryWidget({
  cars,
}: {
  cars: Car[];
}) {
  return (
    <Widget title="Inventory Feed">
      <div className="space-y-3">
        {cars.slice(0, 5).map((c) => (
          <div
            key={c._id}
            className="flex items-center gap-3"
          >
            <div className="w-12 h-10 rounded-lg overflow-hidden bg-dark-700">
              {c.images?.[0] && (
                <img
                  src={c.images[0]}
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            <div className="flex-1">
              <div className="text-sm text-white">
                {c.make} {c.model}
              </div>

              <div className="text-xs text-brand-400">
                #{c.price.toLocaleString()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Widget>
  );
}