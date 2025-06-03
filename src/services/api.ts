/**
 * API service for communicating with the Voltaro backend
 */

const API_BASE_URL = "http://localhost:8000/api";

// Types based on the FastAPI models
export interface ChargePoint {
  id: string;
  vendor: string | null;
  model: string | null;
  status: string;
  is_online: boolean;
  last_seen: string | null;
  created_at: string;
}

export interface Session {
  id: number;
  transaction_id: number;
  charge_point_id: string;
  connector_id: number;
  status: string;
  start_timestamp: string;
  stop_timestamp: string | null;
  energy_consumed: number | null;
  cost: number | null;
}

export interface DashboardStats {
  total_charge_points: number;
  online_charge_points: number;
  active_sessions: number;
  total_energy_consumed: number;
  total_fees_collected: number;
}

export interface IdTag {
  id: number;
  tag: string;
  user_name: string | null;
  user_email: string | null;
  status: string;
}

class APIError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "APIError";
    this.status = status;
  }
}

// Generic fetch wrapper with error handling
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new APIError(
        errorData.detail || `HTTP ${response.status}: ${response.statusText}`,
        response.status,
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    throw new APIError(
      `Network error: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

// Charge Points API
export const chargePointsAPI = {
  // Get all charge points
  getAll: (): Promise<ChargePoint[]> =>
    apiRequest<ChargePoint[]>("/charge-points"),

  // Get specific charge point
  getById: (id: string): Promise<ChargePoint> =>
    apiRequest<ChargePoint>(`/charge-points/${id}`),

  // Create new charge point
  create: (data: {
    id: string;
    vendor?: string;
    model?: string;
    charge_point_serial_number?: string;
    charge_box_serial_number?: string;
    firmware_version?: string;
  }): Promise<ChargePoint> =>
    apiRequest<ChargePoint>("/charge-points", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // Remote start transaction
  startTransaction: (
    chargePointId: string,
    data: {
      id_tag: string;
      connector_id?: number;
    },
  ): Promise<any> =>
    apiRequest(`/charge-points/${chargePointId}/start-transaction`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // Remote stop transaction
  stopTransaction: (
    chargePointId: string,
    data: {
      transaction_id: number;
    },
  ): Promise<any> =>
    apiRequest(`/charge-points/${chargePointId}/stop-transaction`, {
      method: "POST",
      body: JSON.stringify(data),
    }),
};

// Sessions API
export const sessionsAPI = {
  // Get recent sessions
  getAll: (params?: {
    limit?: number;
    charge_point_id?: string;
  }): Promise<Session[]> => {
    const searchParams = new URLSearchParams();
    if (params?.limit) searchParams.append("limit", params.limit.toString());
    if (params?.charge_point_id)
      searchParams.append("charge_point_id", params.charge_point_id);

    const queryString = searchParams.toString();
    return apiRequest<Session[]>(
      `/sessions${queryString ? `?${queryString}` : ""}`,
    );
  },
};

// Dashboard API
export const dashboardAPI = {
  // Get dashboard statistics
  getStats: (): Promise<DashboardStats> =>
    apiRequest<DashboardStats>("/dashboard/stats"),
};

// ID Tags API
export const idTagsAPI = {
  // Get all ID tags
  getAll: (): Promise<IdTag[]> => apiRequest<IdTag[]>("/id-tags"),

  // Create new ID tag
  create: (data: {
    tag: string;
    user_name?: string;
    user_email?: string;
  }): Promise<IdTag> =>
    apiRequest<IdTag>("/id-tags", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};

// Export the APIError for error handling in components
export { APIError };
