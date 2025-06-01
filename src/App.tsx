import { Routes, Route } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import ChargerDetailPage from "./pages/ChargerDetailPage";
import Layout from "./layout/Layout";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/chargers/:id" element={<ChargerDetailPage />} />
      </Routes>
    </Layout>
  );
}
