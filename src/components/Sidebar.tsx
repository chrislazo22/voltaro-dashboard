import { Home, BarChart, Power, Settings, Battery } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import clsx from "clsx";

const navItems = [
  { name: "Overview", href: "/", icon: Home },
  { name: "Sessions", href: "/sessions", icon: BarChart },
  { name: "Chargers", href: "/chargers", icon: Power },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="h-screen w-64 bg-white border-r border-gray-200 flex flex-col shadow-sm">
      {/* Logo/Brand section */}
      <div className="px-6 py-6 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Battery className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">Voltaro</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6">
        <div className="space-y-1">
          {navItems.map(({ name, href, icon: Icon }) => {
            const isActive = location.pathname === href;
            return (
              <Link
                key={name}
                to={href}
                className={clsx(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-blue-50 text-blue-700 border-r-2 border-blue-600"
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900",
                )}
              >
                <Icon
                  className={clsx(
                    "w-5 h-5",
                    isActive ? "text-blue-600" : "text-gray-500",
                  )}
                />
                <span>{name}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Bottom section for additional info */}
      <div className="px-4 py-4 border-t border-gray-200">
        <div className="text-xs text-gray-500 text-center">
          Voltaro Dashboard
        </div>
      </div>
    </aside>
  );
}
