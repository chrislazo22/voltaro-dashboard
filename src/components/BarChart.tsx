interface BarChartProps {
  title: string;
}

export default function BarChart({ title }: BarChartProps) {
  // Static data for MVP - session counts over last 12 periods
  const data = [
    { label: "Jan", value: 65 },
    { label: "Feb", value: 59 },
    { label: "Mar", value: 80 },
    { label: "Apr", value: 81 },
    { label: "May", value: 56 },
    { label: "Jun", value: 55 },
    { label: "Jul", value: 40 },
    { label: "Aug", value: 85 },
    { label: "Sep", value: 75 },
    { label: "Oct", value: 90 },
    { label: "Nov", value: 68 },
    { label: "Dec", value: 72 },
  ];

  const maxValue = Math.max(...data.map((item) => item.value));

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-2 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <div className="text-sm text-gray-500">Last 12 months</div>
      </div>

      <div className="relative">
        {/* Chart area */}
        <div className="relative">
          <div className="absolute left-2 top-0 h-64 flex flex-col justify-between text-xs text-gray-500 z-10">
            <span>{maxValue}</span>
            <span>{Math.round(maxValue * 0.75)}</span>
            <span>{Math.round(maxValue * 0.5)}</span>
            <span>{Math.round(maxValue * 0.25)}</span>
            <span>0</span>
          </div>

          <div className="absolute inset-0">
            {[0, 25, 50, 75, 100].map((percent) => (
              <div
                key={percent}
                className="absolute w-full border-t border-gray-100"
                style={{ top: `${100 - percent}%` }}
              />
            ))}
          </div>

          <div className="relative flex items-end space-x-2 h-64 ml-8">
            {data.map((item, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-blue-500 rounded-t-sm hover:bg-blue-600 transition-colors cursor-pointer"
                  style={{
                    height: `${(item.value / maxValue) * 100}%`,
                    minHeight: "4px",
                  }}
                  title={`${item.label}: ${item.value} sessions`}
                />
              </div>
            ))}
          </div>

          <div className="flex space-x-2 mt-2 ml-8">
            {data.map((item, index) => (
              <div key={index} className="flex-1 text-center">
                <span className="text-xs text-gray-500">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
