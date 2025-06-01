import { type ReactNode } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

export const DashboardLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-8 overflow-y-auto bg-gray-50">{children}</main>
      </div>
    </div>
  );
};
