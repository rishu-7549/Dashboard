import { v4 as uuidv4 } from "uuid";
import { useDashboard } from "../../context/DashboardContext";

export default function WidgetSidebar() {
  const { dispatch } = useDashboard();

  const addWidget = (type) => {
    if (type === "text") {
      dispatch({
        type: "ADD_WIDGET",
        payload: {
          id: uuidv4(),
          type,
          x: 50,
          y: 50,
          width: 300,
          height: 150,
          heading: "New Heading",
          content: "Add your text content here...",
          data: {},
        },
      });
    } else if (type === "chart") {
      dispatch({
        type: "ADD_WIDGET",
        payload: {
          id: uuidv4(),
          type,
          x: 50,
          y: 50,
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
        },
      });
    } else if (type === "table") {
      dispatch({
        type: "ADD_WIDGET",
        payload: {
          id: uuidv4(),
          type,
          x: 50,
          y: 50,
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
        },
      });
    } else if (type === "weather") {
      dispatch({
        type: "ADD_WIDGET",
        payload: {
          id: uuidv4(),
          type,
          x: 50,
          y: 50,
          width: 250,
          height: 200,
          city: "Bangalore",
          temperature: "Loading...",
          condition: "Loading...",
          humidity: "Loading...",
          windSpeed: "Loading...",
          data: {},
        },
      });
    } else if (type === "calendar") {
      dispatch({
        type: "ADD_WIDGET",
        payload: {
          id: uuidv4(),
          type,
          x: 50,
          y: 50,
          width: 300,
          height: 350,
          title: "Calendar",
          events: JSON.stringify([
            { date: "2024-01-15", title: "Team Meeting", time: "10:00 AM" },
            { date: "2024-01-20", title: "Project Deadline", time: "5:00 PM" },
            { date: "2024-01-25", title: "Client Call", time: "2:30 PM" },
          ]),
          data: {},
        },
      });
    } else if (type === "image") {
      dispatch({
        type: "ADD_WIDGET",
        payload: {
          id: uuidv4(),
          type,
          x: 50,
          y: 50,
          width: 300,
          height: 200,
          imageUrl: "https://picsum.photos/300/200",
          altText: "Sample Image",
          caption: "Image Caption",
          data: {},
        },
      });
    } else if (type === "rating") {
      dispatch({
        type: "ADD_WIDGET",
        payload: {
          id: uuidv4(),
          type,
          x: 50,
          y: 50,
          width: 250,
          height: 120,
          title: "Rate this product",
          maxRating: 5,
          currentRating: 3,
          data: {},
        },
      });
    } else if (type === "range-slider") {
      dispatch({
        type: "ADD_WIDGET",
        payload: {
          id: uuidv4(),
          type,
          x: 50,
          y: 50,
          width: 300,
          height: 120,
          title: "Volume Control",
          min: 0,
          max: 100,
          value: 50,
          step: 1,
          data: {},
        },
      });
    } else if (type === "radio-group") {
      dispatch({
        type: "ADD_WIDGET",
        payload: {
          id: uuidv4(),
          type,
          x: 50,
          y: 50,
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
        },
      });
    } else if (type === "microphone") {
      dispatch({
        type: "ADD_WIDGET",
        payload: {
          id: uuidv4(),
          type,
          x: 50,
          y: 50,
          width: 200,
          height: 150,
          title: "Voice Recorder",
          isRecording: false,
          recordingTime: 0,
          data: {},
        },
      });
    } else {
      dispatch({
        type: "ADD_WIDGET",
        payload: {
          id: uuidv4(),
          type,
          x: 50,
          y: 50,
          width: 200,
          height: 100,
          content: "",
          data: {},
        },
      });
    }
  };

  const handleDragStart = (e, type) => {
    e.dataTransfer.setData("application/json", JSON.stringify({ type }));
    e.dataTransfer.effectAllowed = "copy";
  };

  return (
    <div className="bg-gray-200 dark:bg-gray-800 p-2 w-48 text-gray-900 dark:text-gray-100 transition-colors duration-300 overflow-y-auto max-h-screen">
      <h2 className="font-bold mb-2">Widgets</h2>

      {/* Basic Widgets */}
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
          Basic
        </h3>
        <button
          draggable
          onDragStart={(e) => handleDragStart(e, "text")}
          onClick={() => addWidget("text")}
          className="w-full bg-blue-500 text-white p-1 mb-2 rounded hover:bg-blue-600 transition-colors duration-200 cursor-grab active:cursor-grabbing text-sm"
        >
          Add Text
        </button>
        <button
          draggable
          onDragStart={(e) => handleDragStart(e, "button")}
          onClick={() => addWidget("button")}
          className="w-full bg-orange-500 text-white p-1 mb-2 rounded hover:bg-orange-600 transition-colors duration-200 cursor-grab active:cursor-grabbing text-sm"
        >
          Add Button
        </button>
        <button
          draggable
          onDragStart={(e) => handleDragStart(e, "image")}
          onClick={() => addWidget("image")}
          className="w-full bg-purple-500 text-white p-1 mb-2 rounded hover:bg-purple-600 transition-colors duration-200 cursor-grab active:cursor-grabbing text-sm"
        >
          Add Image
        </button>
      </div>

      {/* Data Widgets */}
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
          Data
        </h3>
        <button
          draggable
          onDragStart={(e) => handleDragStart(e, "chart")}
          onClick={() => addWidget("chart")}
          className="w-full bg-green-500 text-white p-1 mb-2 rounded hover:bg-green-600 transition-colors duration-200 cursor-grab active:cursor-grabbing text-sm"
        >
          Add Chart
        </button>
        <button
          draggable
          onDragStart={(e) => handleDragStart(e, "table")}
          onClick={() => addWidget("table")}
          className="w-full bg-indigo-500 text-white p-1 mb-2 rounded hover:bg-indigo-600 transition-colors duration-200 cursor-grab active:cursor-grabbing text-sm"
        >
          Add Table
        </button>
        <button
          draggable
          onDragStart={(e) => handleDragStart(e, "weather")}
          onClick={() => addWidget("weather")}
          className="w-full bg-cyan-500 text-white p-1 mb-2 rounded hover:bg-cyan-600 transition-colors duration-200 cursor-grab active:cursor-grabbing text-sm"
        >
          Add Weather
        </button>
        <button
          draggable
          onDragStart={(e) => handleDragStart(e, "calendar")}
          onClick={() => addWidget("calendar")}
          className="w-full bg-teal-500 text-white p-1 mb-2 rounded hover:bg-teal-600 transition-colors duration-200 cursor-grab active:cursor-grabbing text-sm"
        >
          Add Calendar
        </button>
      </div>

      {/* Interactive Widgets */}
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
          Interactive
        </h3>
        <button
          draggable
          onDragStart={(e) => handleDragStart(e, "rating")}
          onClick={() => addWidget("rating")}
          className="w-full bg-yellow-500 text-white p-1 mb-2 rounded hover:bg-yellow-600 transition-colors duration-200 cursor-grab active:cursor-grabbing text-sm"
        >
          Add Rating
        </button>
        <button
          draggable
          onDragStart={(e) => handleDragStart(e, "range-slider")}
          onClick={() => addWidget("range-slider")}
          className="w-full bg-pink-500 text-white p-1 mb-2 rounded hover:bg-pink-600 transition-colors duration-200 cursor-grab active:cursor-grabbing text-sm"
        >
          Add Range Slider
        </button>
        <button
          draggable
          onDragStart={(e) => handleDragStart(e, "radio-group")}
          onClick={() => addWidget("radio-group")}
          className="w-full bg-red-500 text-white p-1 mb-2 rounded hover:bg-red-600 transition-colors duration-200 cursor-grab active:cursor-grabbing text-sm"
        >
          Add Radio Group
        </button>
        <button
          draggable
          onDragStart={(e) => handleDragStart(e, "microphone")}
          onClick={() => addWidget("microphone")}
          className="w-full bg-gray-600 text-white p-1 mb-2 rounded hover:bg-gray-700 transition-colors duration-200 cursor-grab active:cursor-grabbing text-sm"
        >
          Add Microphone
        </button>
      </div>
    </div>
  );
}
