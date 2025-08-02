import { useDashboard } from "../../context/DashboardContext";

export default function ThemeSwitcher() {
  const { state, dispatch } = useDashboard();

  const toggleTheme = () => {
    dispatch({
      type: "SET_THEME",
      payload: state.theme === "light" ? "dark" : "light",
    });
  };

  return (
    <div className="flex flex-col items-end gap-2">
      {/* Multiplayer Indicator */}
      {state.activeUsers.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 text-xs text-gray-600 dark:text-gray-300">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="font-medium">
              {state.activeUsers.length} active user
              {state.activeUsers.length !== 1 ? "s" : ""}
            </span>
          </div>
          {state.lastModifiedBy && (
            <div className="text-xs opacity-75">
              Last modified by: {state.lastModifiedBy}
            </div>
          )}
        </div>
      )}

      {/* Theme Switcher */}
      <button
        onClick={toggleTheme}
        className="p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-200 dark:border-gray-600 hover:scale-105"
        title={
          state.theme === "light"
            ? "Switch to Dark Mode"
            : "Switch to Light Mode"
        }
      >
        {state.theme === "light" ? (
          // Moon icon for dark mode
          <svg
            className="w-6 h-6 text-gray-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
            />
          </svg>
        ) : (
          // Sun icon for light mode
          <svg
            className="w-6 h-6 text-yellow-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
        )}
      </button>
    </div>
  );
}
