import WidgetSidebar from "../components/sidebar/WidgetSidebar";
import Canvas from "../components/canvas/Canvas";
import PropertiesPanel from "../components/properties/PropertiesPanel";
import ThemeSwitcher from "../components/theming/ThemeSwitcher";
import Header from "../components/Header";
import useFirebaseSync from "../hooks/useFirebaseSync";
import { useDashboard } from "../context/DashboardContext";

export default function DashboardPage({ dashboardId }) {
  useFirebaseSync(dashboardId);
  const { state } = useDashboard();

  // Show loading state while data is being fetched
  if (state.isLoading) {
    return (
      <div className="flex flex-col h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="text-gray-600 dark:text-gray-400">Loading your dashboard...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        <WidgetSidebar />
        <Canvas />
        <PropertiesPanel />
      </div>

      {/* Theme Switcher */}
      <div className="absolute bottom-4 right-4 z-50">
        <ThemeSwitcher />
      </div>
    </div>
  );
}
