interface DonutChartProps {
  title: string;
}

export default function DonutChart({ title }: DonutChartProps) {
  // Static data for MVP
  const data = [
    { label: "Available", value: 60, color: "bg-green-500" },
    { label: "Charging", value: 25, color: "bg-blue-500" },
    { label: "Offline", value: 10, color: "bg-gray-400" },
    { label: "Out of order", value: 5, color: "bg-red-500" },
  ];

  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">{title}</h3>

      <div className="flex items-center justify-between">
        {/* Donut Chart */}
        <div className="relative w-40 h-40">
          <div className="w-full h-full rounded-full relative overflow-hidden">
            {/* Create segments using conic-gradient */}
            <div
              className="w-full h-full rounded-full"
              style={{
                background: `conic-gradient(
                  from 0deg,
                  #10b981 0% ${(data[0].value / total) * 100}%,
                  #3b82f6 ${(data[0].value / total) * 100}% ${((data[0].value + data[1].value) / total) * 100}%,
                  #9ca3af ${((data[0].value + data[1].value) / total) * 100}% ${((data[0].value + data[1].value + data[2].value) / total) * 100}%,
                  #ef4444 ${((data[0].value + data[1].value + data[2].value) / total) * 100}% 100%
                )`,
              }}
            />
            {/* Inner circle to create donut effect */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-white rounded-full flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{total}</div>
                <div className="text-xs text-gray-500">Total</div>
              </div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex-1 ml-8">
          <div className="space-y-3">
            {data.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${item.color}`} />
                  <span className="text-sm text-gray-700">{item.label}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-900">
                    {item.value}
                  </span>
                  <span className="text-xs text-gray-500">
                    ({Math.round((item.value / total) * 100)}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

