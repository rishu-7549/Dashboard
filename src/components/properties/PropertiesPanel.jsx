import { useDashboard } from "../../context/DashboardContext";
import { useCallback } from "react";

export default function PropertiesPanel() {
  const { state, dispatch } = useDashboard();
  const widget = state.widgets.find((w) => w.id === state.selectedWidgetId);

  if (!widget)
    return (
      <div className="w-64 p-2 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
        Select a widget
      </div>
    );

  const updateWidgetData = useCallback(
    (key, value) => {
      dispatch({
        type: "UPDATE_WIDGET",
        payload: { id: widget.id, data: { [key]: value } },
      });
    },
    [widget.id, dispatch]
  );

  const deleteWidget = () => {
    dispatch({ type: "DELETE_WIDGET", payload: widget.id });
    dispatch({ type: "SET_SELECTED_WIDGET", payload: null });
  };

  return (
    <div className="w-64 p-2 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300 overflow-y-auto max-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold">Properties</h2>
        <button
          onClick={deleteWidget}
          className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors duration-200 flex items-center gap-1"
          title="Delete widget"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5.133 7H5a2 2 0 01-2-2V5a2 2 0 012-2h4a2 2 0 012-2h4a2 2 0 012 2v1a2 2 0 01-2 2h-1z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 11v6M14 11v6M4 7h16M8 7V5a1 1 0 011-1h6a1 1 0 011 1v2"
            />
          </svg>
          Delete
        </button>
      </div>

      {widget.type === "text" && (
        <>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Heading:
          </label>
          <input
            type="text"
            className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 w-full mb-3 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            value={widget.heading || ""}
            onChange={(e) => updateWidgetData("heading", e.target.value)}
            placeholder="Enter heading..."
          />
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Content:
          </label>
          <textarea
            className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 w-full mb-3 text-sm resize-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            rows="4"
            value={widget.content || ""}
            onChange={(e) => updateWidgetData("content", e.target.value)}
            placeholder="Enter content..."
          />
        </>
      )}

      {widget.type === "chart" && (
        <>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Chart Title:
          </label>
          <input
            type="text"
            className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 w-full mb-3 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            value={widget.chartTitle || "Sample Bar Chart"}
            onChange={(e) => updateWidgetData("chartTitle", e.target.value)}
            placeholder="Enter chart title..."
          />
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Chart Data (JSON):
          </label>
          <textarea
            className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 w-full mb-3 text-sm resize-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            rows="8"
            value={
              widget.chartData ||
              JSON.stringify(
                {
                  labels: [
                    "Red",
                    "Blue",
                    "Yellow",
                    "Green",
                    "Purple",
                    "Orange",
                  ],
                  datasets: [
                    {
                      label: "Votes",
                      data: [12, 19, 3, 5, 2, 3],
                      backgroundColor: [
                        "rgba(255, 99, 132, 0.5)",
                        "rgba(54, 162, 235, 0.5)",
                        "rgba(255, 206, 86, 0.5)",
                        "rgba(75, 192, 192, 0.5)",
                        "rgba(153, 102, 255, 0.5)",
                        "rgba(255, 159, 64, 0.5)",
                      ],
                      borderColor: [
                        "rgba(255, 99, 132, 1)",
                        "rgba(54, 162, 235, 1)",
                        "rgba(255, 206, 86, 1)",
                        "rgba(75, 192, 192, 1)",
                        "rgba(153, 102, 255, 1)",
                        "rgba(255, 159, 64, 1)",
                      ],
                      borderWidth: 1,
                    },
                  ],
                },
                null,
                2
              )
            }
            onChange={(e) => updateWidgetData("chartData", e.target.value)}
            placeholder="Enter chart data in JSON format..."
          />
        </>
      )}

      {widget.type === "table" && (
        <>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Table Title:
          </label>
          <input
            type="text"
            className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 w-full mb-3 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            value={widget.tableTitle || "Sample Table"}
            onChange={(e) => updateWidgetData("tableTitle", e.target.value)}
            placeholder="Enter table title..."
          />
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Table Data (JSON):
          </label>
          <textarea
            className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 w-full mb-3 text-sm resize-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            rows="10"
            value={
              widget.tableData ||
              JSON.stringify(
                {
                  headers: ["Name", "Age", "City", "Salary"],
                  rows: [
                    ["John Doe", "30", "New York", "$50,000"],
                    ["Jane Smith", "25", "Los Angeles", "$45,000"],
                    ["Bob Johnson", "35", "Chicago", "$60,000"],
                    ["Alice Brown", "28", "Houston", "$55,000"],
                  ],
                },
                null,
                2
              )
            }
            onChange={(e) => updateWidgetData("tableData", e.target.value)}
            placeholder="Enter table data in JSON format..."
          />
        </>
      )}

      {widget.type === "weather" && (
        <>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            City:
          </label>
          <input
            type="text"
            className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 w-full mb-3 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            value={widget.city || "New York"}
            onChange={(e) => updateWidgetData("city", e.target.value)}
            placeholder="Enter city name..."
          />
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Temperature:
          </label>
          <input
            type="text"
            className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 w-full mb-3 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            value={widget.temperature || "72°F"}
            onChange={(e) => updateWidgetData("temperature", e.target.value)}
            placeholder="Enter temperature..."
          />
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Condition:
          </label>
          <input
            type="text"
            className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 w-full mb-3 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            value={widget.condition || "Sunny"}
            onChange={(e) => updateWidgetData("condition", e.target.value)}
            placeholder="Enter weather condition..."
          />
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Humidity:
          </label>
          <input
            type="text"
            className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 w-full mb-3 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            value={widget.humidity || "65%"}
            onChange={(e) => updateWidgetData("humidity", e.target.value)}
            placeholder="Enter humidity..."
          />
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Wind Speed:
          </label>
          <input
            type="text"
            className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 w-full mb-3 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            value={widget.windSpeed || "8 mph"}
            onChange={(e) => updateWidgetData("windSpeed", e.target.value)}
            placeholder="Enter wind speed..."
          />
        </>
      )}

      {widget.type === "calendar" && (
        <>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Title:
          </label>
          <input
            type="text"
            className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 w-full mb-3 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            value={widget.title || "Calendar"}
            onChange={(e) => updateWidgetData("title", e.target.value)}
            placeholder="Enter calendar title..."
          />
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Events (JSON):
          </label>
          <textarea
            className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 w-full mb-3 text-sm resize-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            rows="8"
            value={
              widget.events ||
              JSON.stringify(
                [
                  {
                    date: "2024-01-15",
                    title: "Team Meeting",
                    time: "10:00 AM",
                  },
                  {
                    date: "2024-01-20",
                    title: "Project Deadline",
                    time: "5:00 PM",
                  },
                  { date: "2024-01-25", title: "Client Call", time: "2:30 PM" },
                ],
                null,
                2
              )
            }
            onChange={(e) => updateWidgetData("events", e.target.value)}
            placeholder="Enter events in JSON format..."
          />
        </>
      )}

      {widget.type === "image" && (
        <>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Image URL:
          </label>
          <input
            type="url"
            className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 w-full mb-3 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            value={widget.imageUrl || "https://picsum.photos/300/200"}
            onChange={(e) => updateWidgetData("imageUrl", e.target.value)}
            placeholder="Enter image URL..."
          />
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Alt Text:
          </label>
          <input
            type="text"
            className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 w-full mb-3 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            value={widget.altText || "Sample Image"}
            onChange={(e) => updateWidgetData("altText", e.target.value)}
            placeholder="Enter alt text..."
          />
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Caption:
          </label>
          <input
            type="text"
            className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 w-full mb-3 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            value={widget.caption || "Image Caption"}
            onChange={(e) => updateWidgetData("caption", e.target.value)}
            placeholder="Enter caption..."
          />
        </>
      )}

      {widget.type === "rating" && (
        <>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Title:
          </label>
          <input
            type="text"
            className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 w-full mb-3 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            value={widget.title || "Rate this product"}
            onChange={(e) => updateWidgetData("title", e.target.value)}
            placeholder="Enter rating title..."
          />
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Max Rating:
          </label>
          <input
            type="number"
            min="1"
            max="10"
            className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 w-full mb-3 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            value={widget.maxRating || 5}
            onChange={(e) =>
              updateWidgetData("maxRating", parseInt(e.target.value))
            }
          />
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Current Rating:
          </label>
          <input
            type="number"
            min="0"
            max={widget.maxRating || 5}
            className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 w-full mb-3 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            value={widget.currentRating || 3}
            onChange={(e) =>
              updateWidgetData("currentRating", parseInt(e.target.value))
            }
          />
        </>
      )}

      {widget.type === "range-slider" && (
        <>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Title:
          </label>
          <input
            type="text"
            className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 w-full mb-3 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            value={widget.title || "Volume Control"}
            onChange={(e) => updateWidgetData("title", e.target.value)}
            placeholder="Enter slider title..."
          />
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Min Value:
          </label>
          <input
            type="number"
            className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 w-full mb-3 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            value={widget.min || 0}
            onChange={(e) => updateWidgetData("min", parseInt(e.target.value))}
          />
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Max Value:
          </label>
          <input
            type="number"
            className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 w-full mb-3 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            value={widget.max || 100}
            onChange={(e) => updateWidgetData("max", parseInt(e.target.value))}
          />
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Current Value:
          </label>
          <input
            type="number"
            min={widget.min || 0}
            max={widget.max || 100}
            className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 w-full mb-3 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            value={widget.value || 50}
            onChange={(e) =>
              updateWidgetData("value", parseInt(e.target.value))
            }
          />
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Step:
          </label>
          <input
            type="number"
            min="0.1"
            step="0.1"
            className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 w-full mb-3 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            value={widget.step || 1}
            onChange={(e) =>
              updateWidgetData("step", parseFloat(e.target.value))
            }
          />
        </>
      )}

      {widget.type === "radio-group" && (
        <>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Title:
          </label>
          <input
            type="text"
            className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 w-full mb-3 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            value={widget.title || "Select your preference"}
            onChange={(e) => updateWidgetData("title", e.target.value)}
            placeholder="Enter radio group title..."
          />
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Options (JSON):
          </label>
          <textarea
            className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 w-full mb-3 text-sm resize-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            rows="4"
            value={
              widget.options ||
              JSON.stringify(
                ["Option 1", "Option 2", "Option 3", "Option 4"],
                null,
                2
              )
            }
            onChange={(e) => updateWidgetData("options", e.target.value)}
            placeholder="Enter options as JSON array..."
          />
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Selected Option:
          </label>
          <input
            type="text"
            className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 w-full mb-3 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            value={widget.selectedOption || "Option 1"}
            onChange={(e) => updateWidgetData("selectedOption", e.target.value)}
            placeholder="Enter selected option..."
          />
        </>
      )}

      {widget.type === "microphone" && (
        <>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Title:
          </label>
          <input
            type="text"
            className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 w-full mb-3 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            value={widget.title || "Voice Recorder"}
            onChange={(e) => updateWidgetData("title", e.target.value)}
            placeholder="Enter microphone title..."
          />
        </>
      )}

      {widget.type !== "text" &&
        widget.type !== "chart" &&
        widget.type !== "table" &&
        widget.type !== "weather" &&
        widget.type !== "calendar" &&
        widget.type !== "image" &&
        widget.type !== "rating" &&
        widget.type !== "range-slider" &&
        widget.type !== "radio-group" &&
        widget.type !== "microphone" && (
          <>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Content:
            </label>
            <textarea
              className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 w-full mb-3 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              value={widget.content || ""}
              onChange={(e) => updateWidgetData("content", e.target.value)}
            />
          </>
        )}

      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        Width:
      </label>
      <input
        type="number"
        className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 w-full mb-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        value={widget.width}
        onChange={(e) => updateWidgetData("width", parseInt(e.target.value))}
      />
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        Height:
      </label>
      <input
        type="number"
        className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 w-full mb-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        value={widget.height}
        onChange={(e) => updateWidgetData("height", parseInt(e.target.value))}
      />
    </div>
  );
}
