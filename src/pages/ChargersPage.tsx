import { useState, useEffect } from "react";
import { DashboardLayout } from "../layout/DashboardLayout";
import { chargePointsAPI, type ChargePoint, APIError } from "../services/api";
import {
  ChevronDown,
  Plus,
  AlertCircle,
  Play,
  Square,
  Loader2,
} from "lucide-react";
import { sessionsAPI } from "../services/api";

// Helper function to get status color
const getStatusColor = (status: string, isOnline: boolean) => {
  if (!isOnline) return "bg-gray-400 text-gray-800";

  switch (status.toLowerCase()) {
    case "available":
      return "bg-green-500 text-white";
    case "occupied":
    case "charging":
      return "bg-blue-500 text-white";
    case "faulted":
    case "out of order":
      return "bg-red-500 text-white";
    case "preparing":
      return "bg-yellow-500 text-white";
    default:
      return "bg-gray-400 text-gray-800";
  }
};

// Helper function to format last seen date
const formatLastSeen = (lastSeen: string | null) => {
  if (!lastSeen) return "Never";

  const date = new Date(lastSeen);
  const now = new Date();
  const diffInMinutes = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60),
  );

  if (diffInMinutes < 1) return "Just now";
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;

  return date.toLocaleDateString();
};

export default function ChargersPage() {
  const [chargePoints, setChargePoints] = useState<ChargePoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [locationFilter, setLocationFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Fetch charge points on component mount
  useEffect(() => {
    fetchChargePoints();
  }, []);

  const fetchChargePoints = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await chargePointsAPI.getAll();
      setChargePoints(data);
    } catch (err) {
      if (err instanceof APIError) {
        setError(err.message);
      } else {
        setError("Failed to fetch charge points");
      }
      console.error("Error fetching charge points:", err);
    } finally {
      setLoading(false);
    }
  };

  // Calculate online status
  const onlineCount = chargePoints.filter((cp) => cp.is_online).length;
  const totalCount = chargePoints.length;

  // Filter charge points
  const filteredChargePoints = chargePoints.filter((cp) => {
    if (locationFilter !== "all" && !cp.id.includes(locationFilter))
      return false;
    if (
      statusFilter !== "all" &&
      cp.status.toLowerCase() !== statusFilter.toLowerCase()
    )
      return false;
    return true;
  });

  // Get unique locations for filter dropdown
  const locations = Array.from(
    new Set(chargePoints.map((cp) => cp.id.split("-")[0] || "Unknown")),
  );

  // Handle remote start transaction
  const handleRemoteStart = async (chargePointId: string) => {
    try {
      setActionLoading(`start-${chargePointId}`);

      // Use default ID tag for testing
      const result = await chargePointsAPI.startTransaction(chargePointId, {
        id_tag: "VALID001", // Test ID tag
        connector_id: 1, // Default connector
      });

      if (result.success) {
        // Show success message
        alert(`Remote start successful! Status: ${result.status}`);
        // Refresh charge points to get updated status
        await fetchChargePoints();
      } else {
        alert(`Remote start failed: ${result.error || "Unknown error"}`);
      }
    } catch (err) {
      console.error("Error starting transaction:", err);
      if (err instanceof APIError) {
        alert(`Failed to start transaction: ${err.message}`);
      } else {
        alert("Failed to start transaction: Network error");
      }
    } finally {
      setActionLoading(null);
    }
  };

  // Handle remote stop transaction
  const handleRemoteStop = async (chargePointId: string) => {
    try {
      setActionLoading(`stop-${chargePointId}`);

      // First, get active sessions for this charge point
      const sessions = await sessionsAPI.getAll({
        charge_point_id: chargePointId,
      });
      const activeSessions = sessions.filter(
        (session) => session.status === "Active",
      );

      if (activeSessions.length === 0) {
        alert("No active transactions found for this charge point");
        return;
      }

      // Use the first active transaction (in a real app, you might show a selection)
      const activeSession = activeSessions[0];

      const result = await chargePointsAPI.stopTransaction(chargePointId, {
        transaction_id: activeSession.transaction_id,
      });

      if (result.success) {
        alert(
          `Remote stop successful! Status: ${result.status}\nTransaction ID: ${activeSession.transaction_id}`,
        );
        await fetchChargePoints();
      } else {
        alert(`Remote stop failed: ${result.error || "Unknown error"}`);
      }
    } catch (err) {
      console.error("Error stopping transaction:", err);
      if (err instanceof APIError) {
        alert(`Failed to stop transaction: ${err.message}`);
      } else {
        alert("Failed to stop transaction: Network error");
      }
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading charge points...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Chargers</h1>
          <button
            onClick={() => console.log("coming soon")}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Charger</span>
          </button>
        </div>

        {/* Error state */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <span className="text-red-700">{error}</span>
              <button
                onClick={fetchChargePoints}
                className="ml-auto text-red-600 hover:text-red-800 underline"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Charger Overview */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            CHARGER OVERVIEW
          </h2>
          <div className="flex items-center space-x-2">
            <div
              className={`w-3 h-3 rounded-full ${onlineCount === totalCount ? "bg-green-500" : "bg-yellow-500"}`}
            />
            <span className="text-sm text-gray-700">
              {onlineCount === totalCount
                ? "All chargers are online"
                : `${onlineCount} of ${totalCount} chargers online`}
            </span>
          </div>
        </div>

        {/* Filters and Table */}
        <div className="bg-white rounded-lg border border-gray-200">
          {/* Filter Bar */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex space-x-4">
              {/* Location Filter */}
              <div className="relative">
                <select
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Locations</option>
                  {locations.map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>

              {/* Status Filter */}
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Statuses</option>
                  <option value="available">Available</option>
                  <option value="occupied">Occupied</option>
                  <option value="charging">Charging</option>
                  <option value="faulted">Faulted</option>
                  <option value="unknown">Unknown</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Charger
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Model
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last seen
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Connection
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredChargePoints.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      {chargePoints.length === 0
                        ? "No charge points found"
                        : "No charge points match the current filters"}
                    </td>
                  </tr>
                ) : (
                  filteredChargePoints.map((chargePoint) => (
                    <tr key={chargePoint.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {chargePoint.id}
                        </div>
                        {chargePoint.vendor && (
                          <div className="text-sm text-gray-500">
                            {chargePoint.vendor}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {chargePoint.model || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(chargePoint.status, chargePoint.is_online)}`}
                        >
                          {chargePoint.is_online
                            ? chargePoint.status
                            : "Offline"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatLastSeen(chargePoint.last_seen)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            chargePoint.is_online
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {chargePoint.is_online ? "Online" : "Offline"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900 mr-3">
                          View
                        </button>

                        {/* Start Button */}
                        <button
                          onClick={() => handleRemoteStart(chargePoint.id)}
                          disabled={
                            !chargePoint.is_online ||
                            actionLoading === `start-${chargePoint.id}`
                          }
                          className="text-green-600 hover:text-green-900 mr-3 disabled:text-gray-400 disabled:cursor-not-allowed flex items-center space-x-1"
                        >
                          {actionLoading === `start-${chargePoint.id}` ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Play className="w-4 h-4" />
                          )}
                          <span>Start</span>
                        </button>

                        {/* Stop Button */}
                        <button
                          onClick={() => handleRemoteStop(chargePoint.id)}
                          disabled={
                            !chargePoint.is_online ||
                            actionLoading === `stop-${chargePoint.id}`
                          }
                          className="text-red-600 hover:text-red-900 disabled:text-gray-400 disabled:cursor-not-allowed flex items-center space-x-1"
                        >
                          {actionLoading === `stop-${chargePoint.id}` ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                          <span>Stop</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
