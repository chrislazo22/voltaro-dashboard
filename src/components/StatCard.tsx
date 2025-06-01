interface StatCardProps {
  title: string;
  value: string;
  unit?: string;
}

export default function StatCard({ title, value, unit }: StatCardProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex flex-col space-y-2">
        <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">
          {title}
        </h3>
        <div className="flex items-baseline space-x-1">
          <span className="text-3xl font-bold text-gray-900">{value}</span>
          {unit && (
            <span className="text-lg font-medium text-gray-500">{unit}</span>
          )}
        </div>
      </div>
    </div>
  );
}

