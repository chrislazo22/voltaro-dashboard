import { DashboardLayout } from "../layout/DashboardLayout";
import StatCard from "../components/StatCard";
import DonutChart from "../components/DonutChart";
import BarChart from "../components/BarChart";

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <StatCard 
            title="Fees collected" 
            value="$246.20" 
          />
          <StatCard 
            title="Energy used" 
            value="805" 
            unit="kWh" 
          />
          <StatCard 
            title="Sessions" 
            value="48" 
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DonutChart title="Charger status" />
          <BarChart title="Sessions" />
        </div>
        
        {/* Placeholder for future components */}
        <div className="text-gray-500 text-center py-12">
          <p>Session table coming next...</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
