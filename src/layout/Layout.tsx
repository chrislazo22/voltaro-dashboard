import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="p-4 bg-white shadow">Voltaro Admin</header>
      <main className="p-6">{children}</main>
    </div>
  );
}
