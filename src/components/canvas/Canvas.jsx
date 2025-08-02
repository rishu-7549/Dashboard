import { Rnd } from "react-rnd";
import { useDashboard } from "../../context/DashboardContext";
import WidgetRenderer from "./WidgetRenderer";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

// Utility function to check if two rectangles overlap
const doRectanglesOverlap = (rect1, rect2) => {
  return !(
    rect1.x + rect1.width <= rect2.x ||
    rect1.x >= rect2.x + rect2.width ||
    rect1.y + rect1.height <= rect2.y ||
    rect1.y >= rect2.y + rect2.height
  );
};

// Utility function to find a non-overlapping position for a new widget
const findNonOverlappingPosition = (
  newWidget,
  existingWidgets,
  canvasWidth = 1200,
  canvasHeight = 800
) => {
  const gridSize = 20; // Grid size for positioning
  const maxAttempts = 1000;
  let attempts = 0;

  let testX = newWidget.x;
  let testY = newWidget.y;

  while (attempts < maxAttempts) {
    const testRect = {
      x: testX,
      y: testY,
      width: newWidget.width,
      height: newWidget.height,
    };

    // Check if position is within canvas bounds
    if (
      testX < 0 ||
      testY < 0 ||
      testX + newWidget.width > canvasWidth ||
      testY + newWidget.height > canvasHeight
    ) {
      // Try next grid position
      testX += gridSize;
      if (testX > canvasWidth - newWidget.width) {
        testX = 0;
        testY += gridSize;
      }
      attempts++;
      continue;
    }

    // Check for overlaps with existing widgets
    const hasOverlap = existingWidgets.some((existing) =>
      doRectanglesOverlap(testRect, {
        x: existing.x,
        y: existing.y,
        width: existing.width,
        height: existing.height,
      })
    );

    if (!hasOverlap) {
      return { x: testX, y: testY };
    }

    // Try next grid position
    testX += gridSize;
    if (testX > canvasWidth - newWidget.width) {
      testX = 0;
      testY += gridSize;
    }
    attempts++;
  }

  // If no position found, return original position
  return { x: newWidget.x, y: newWidget.y };
};

// Utility function to check if a position would cause overlaps
const checkForOverlaps = (widgetId, x, y, width, height, allWidgets) => {
  const testRect = { x, y, width, height };
  return allWidgets
    .filter((widget) => widget.id !== widgetId)
    .some((widget) =>
      doRectanglesOverlap(testRect, {
        x: widget.x,
        y: widget.y,
        width: widget.width,
        height: widget.height,
      })
    );
};

export default function Canvas() {
  const { state, dispatch } = useDashboard();
  const [overlappingWidgets, setOverlappingWidgets] = useState(new Set());

  const updateWidget = (id, x, y, w, h) => {
    // Check for overlaps before updating
    const wouldOverlap = checkForOverlaps(id, x, y, w, h, state.widgets);

    if (wouldOverlap) {
      setOverlappingWidgets((prev) => new Set([...prev, id]));
      return; // Don't update if it would cause overlap
    } else {
      setOverlappingWidgets((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }

    dispatch({
      type: "UPDATE_WIDGET",
      payload: { id, data: { x, y, width: w, height: h } },
    });
  };

  const deleteWidget = (id) => {
    console.log("Canvas: Deleting widget", id);
    dispatch({ type: "DELETE_WIDGET", payload: id });
    dispatch({ type: "SET_SELECTED_WIDGET", payload: null });
    setOverlappingWidgets((prev) => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const canvasRect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - canvasRect.left;
    const y = e.clientY - canvasRect.top;

    try {
      const data = JSON.parse(e.dataTransfer.getData("application/json"));
      const type = data.type;

      let newWidget = null;

      if (type === "text") {
        newWidget = {
          id: uuidv4(),
          type,
          x,
          y,
          width: 300,
          height: 150,
          heading: "New Heading",
          content: "Add your text content here...",
          data: {},
        };
      } else if (type === "chart") {
        newWidget = {
          id: uuidv4(),
          type,
          x,
          y,
          width: 400,
          height: 300,
          chartTitle: "Sample Bar Chart",
          chartData: JSON.stringify(
            {
              labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
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
          ),
          data: {},
        };
      } else if (type === "table") {
        newWidget = {
          id: uuidv4(),
          type,
          x,
          y,
          width: 500,
          height: 300,
          tableTitle: "Sample Table",
          tableData: JSON.stringify(
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
          ),
          data: {},
        };
      } else if (type === "button") {
        newWidget = {
          id: uuidv4(),
          type,
          x,
          y,
          width: 200,
          height: 100,
          content: "Click Me",
          data: {},
        };
      } else if (type === "weather") {
        newWidget = {
          id: uuidv4(),
          type,
          x,
          y,
          width: 250,
          height: 200,
          city: "Bangalore",
          temperature: "Loading...",
          condition: "Loading...",
          humidity: "Loading...",
          windSpeed: "Loading...",
          data: {},
        };
      } else if (type === "calendar") {
        newWidget = {
          id: uuidv4(),
          type,
          x,
          y,
          width: 300,
          height: 350,
          title: "Calendar",
          events: JSON.stringify([
            { date: "2024-01-15", title: "Team Meeting", time: "10:00 AM" },
            {
              date: "2024-01-20",
              title: "Project Deadline",
              time: "5:00 PM",
            },
            { date: "2024-01-25", title: "Client Call", time: "2:30 PM" },
          ]),
          data: {},
        };
      } else if (type === "image") {
        newWidget = {
          id: uuidv4(),
          type,
          x,
          y,
          width: 300,
          height: 200,
          imageUrl: "https://picsum.photos/300/200",
          altText: "Sample Image",
          caption: "Image Caption",
          data: {},
        };
      } else if (type === "rating") {
        newWidget = {
          id: uuidv4(),
          type,
          x,
          y,
          width: 250,
          height: 120,
          title: "Rate this product",
          maxRating: 5,
          currentRating: 3,
          data: {},
        };
      } else if (type === "range-slider") {
        newWidget = {
          id: uuidv4(),
          type,
          x,
          y,
          width: 300,
          height: 120,
          title: "Volume Control",
          min: 0,
          max: 100,
          value: 50,
          step: 1,
          data: {},
        };
      } else if (type === "radio-group") {
        newWidget = {
          id: uuidv4(),
          type,
          x,
          y,
          width: 250,
          height: 200,
          title: "Select your preference",
          options: JSON.stringify([
            "Option 1",
            "Option 2",
            "Option 3",
            "Option 4",
          ]),
          selectedOption: "Option 1",
          data: {},
        };
      } else if (type === "microphone") {
        newWidget = {
          id: uuidv4(),
          type,
          x,
          y,
          width: 200,
          height: 150,
          title: "Voice Recorder",
          isRecording: false,
          recordingTime: 0,
          data: {},
        };
      }

      if (newWidget) {
        // Find a non-overlapping position for the new widget
        const nonOverlappingPos = findNonOverlappingPosition(
          newWidget,
          state.widgets
        );
        newWidget.x = nonOverlappingPos.x;
        newWidget.y = nonOverlappingPos.y;

        dispatch({
          type: "ADD_WIDGET",
          payload: newWidget,
        });
      }
    } catch (error) {
      console.error("Error parsing drop data:", error);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  };

  // Handle keyboard events for delete functionality
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Delete" && state.selectedWidgetId) {
        e.preventDefault();
        console.log(
          "Keyboard delete triggered for widget:",
          state.selectedWidgetId
        );
        deleteWidget(state.selectedWidgetId);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [state.selectedWidgetId]);

  return (
    <div
      className="flex-1 relative bg-gray-100 dark:bg-gray-700 transition-colors duration-300"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      {state.widgets.map((widget) => (
        <Rnd
          key={widget.id}
          size={{ width: widget.width, height: widget.height }}
          position={{ x: widget.x, y: widget.y }}
          bounds="parent"
          onClick={() =>
            dispatch({ type: "SET_SELECTED_WIDGET", payload: widget.id })
          }
          onDragStop={(e, d) =>
            updateWidget(widget.id, d.x, d.y, widget.width, widget.height)
          }
          onResizeStop={(e, dir, ref, delta, pos) =>
            updateWidget(
              widget.id,
              pos.x,
              pos.y,
              ref.offsetWidth,
              ref.offsetHeight
            )
          }
          className={`${
            state.selectedWidgetId === widget.id
              ? "ring-2 ring-blue-500 ring-opacity-50"
              : ""
          } ${
            overlappingWidgets.has(widget.id)
              ? "ring-2 ring-red-500 ring-opacity-75"
              : ""
          }`}
        >
          <div className="relative w-full h-full">
            <WidgetRenderer widget={widget} />

            {/* Delete button for selected widget */}
            {state.selectedWidgetId === widget.id && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  console.log("Delete button clicked for widget:", widget.id);
                  deleteWidget(widget.id);
                }}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors duration-200 shadow-lg z-10"
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}

            {/* Overlap warning indicator */}
            {overlappingWidgets.has(widget.id) && (
              <div className="absolute -top-8 left-0 bg-red-500 text-white text-xs px-2 py-1 rounded shadow-lg z-20">
                Overlap detected
              </div>
            )}
          </div>
        </Rnd>
      ))}
    </div>
  );
}
