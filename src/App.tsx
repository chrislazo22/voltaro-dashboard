import { Routes, Route } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import ChargersPage from "./pages/ChargersPage";
import LoginPage from "./pages/LoginPage";
import ChargerDetailPage from "./pages/ChargerDetailPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/chargers" element={<ChargersPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/chargers/:id" element={<ChargerDetailPage />} />
    </Routes>
  );
}
