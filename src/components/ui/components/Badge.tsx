export default function Badge({
  label,
  color = 'bg-gray-500/15 text-gray-300',
}: {
  label: string;
  color?: string;
}) {
  return (
    <span className={`px-2 py-1 text-xs rounded-full ${color}`}>
      {label}
    </span>
  );
}