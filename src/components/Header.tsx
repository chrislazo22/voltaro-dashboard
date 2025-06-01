import { ChevronDown, User } from "lucide-react";
import { useState } from "react";

export default function Header() {
  const [selectedLocation, setSelectedLocation] = useState("Glendale, AZ");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const locations = ["Los Angeles, CA", "Denver, CO", "Amsterdam, Netherlands"];

  return (
    <header className="bg-white border-b border-gray-200 px-8 py-5">
      <div className="flex items-center justify-between">
        {/* Left side - Page title */}
        <div className="flex items-center space-x-8">
          <h1 className="text-3xl font-bold text-gray-900">Overview</h1>

          {/* Location selector dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
            >
              <span>{selectedLocation}</span>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>

            {isDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-52 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                {locations.map((location) => (
                  <button
                    key={location}
                    onClick={() => {
                      setSelectedLocation(location);
                      setIsDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg transition-colors"
                  >
                    {location}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right side - User profile */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors cursor-pointer">
            <User className="w-5 h-5 text-gray-600" />
          </div>
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors cursor-pointer">
            <span className="text-white text-sm font-semibold">J</span>
          </div>
        </div>
      </div>
    </header>
  );
}
