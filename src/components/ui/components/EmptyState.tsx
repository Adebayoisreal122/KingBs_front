export default function EmptyState({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="text-center py-12 text-gray-400">
      <p className="text-white font-semibold">{title}</p>
      {description && <p className="text-sm mt-1">{description}</p>}
    </div>
  );
}