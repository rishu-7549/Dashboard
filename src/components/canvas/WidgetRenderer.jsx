import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useState, useEffect } from "react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function WidgetRenderer({ widget }) {
  const [rating, setRating] = useState(widget.currentRating || 0);
  const [sliderValue, setSliderValue] = useState(widget.value || 50);
  const [selectedRadio, setSelectedRadio] = useState(
    widget.selectedOption || "Option 1"
  );
  const [isRecording, setIsRecording] = useState(widget.isRecording || false);
  const [recordingTime, setRecordingTime] = useState(widget.recordingTime || 0);

  // Update local state when widget data changes
  useEffect(() => {
    setRating(widget.currentRating || 0);
    setSliderValue(widget.value || 50);
    setSelectedRadio(widget.selectedOption || "Option 1");
    setIsRecording(widget.isRecording || false);
    setRecordingTime(widget.recordingTime || 0);
  }, [
    widget.currentRating,
    widget.value,
    widget.selectedOption,
    widget.isRecording,
    widget.recordingTime,
  ]);

  // Recording timer effect
  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  switch (widget.type) {
    case "text":
      return (
        <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 p-4 h-full transition-colors duration-300">
          <h3 className="font-bold text-lg mb-2 text-gray-800 dark:text-gray-200">
            {widget.heading || "Heading"}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
            {widget.content || "Add your text content here..."}
          </p>
        </div>
      );
    case "chart":
      // Parse chart data from widget or use default
      let chartData;
      try {
        chartData = widget.chartData ? JSON.parse(widget.chartData) : null;
      } catch (error) {
        console.error("Invalid chart data JSON:", error);
        chartData = null;
      }

      // Default chart data if none provided or invalid
      const defaultData = {
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
      };

      // Use provided data or default, and ensure colors are always included
      const baseData = chartData || defaultData;
      const data = {
        labels: baseData.labels,
        datasets: baseData.datasets.map((dataset, index) => ({
          ...dataset,
          backgroundColor:
            dataset.backgroundColor ||
            [
              "rgba(255, 99, 132, 0.5)",
              "rgba(54, 162, 235, 0.5)",
              "rgba(255, 206, 86, 0.5)",
              "rgba(75, 192, 192, 0.5)",
              "rgba(153, 102, 255, 0.5)",
              "rgba(255, 159, 64, 0.5)",
            ].slice(0, dataset.data.length),
          borderColor:
            dataset.borderColor ||
            [
              "rgba(255, 99, 132, 1)",
              "rgba(54, 162, 235, 1)",
              "rgba(255, 206, 86, 1)",
              "rgba(75, 192, 192, 1)",
              "rgba(153, 102, 255, 1)",
              "rgba(255, 159, 64, 1)",
            ].slice(0, dataset.data.length),
          borderWidth: dataset.borderWidth || 1,
        })),
      };

      const options = {
        responsive: true,
        plugins: {
          legend: { position: "top" },
          title: {
            display: true,
            text: widget.chartTitle || "Sample Bar Chart",
          },
        },
        maintainAspectRatio: false,
      };
      return (
        <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 p-2 w-full h-full flex items-center justify-center transition-colors duration-300">
          <div style={{ width: "100%", height: "100%" }}>
            <Bar data={data} options={options} />
          </div>
        </div>
      );
    case "table":
      // Parse table data from widget or use default
      let tableData;
      try {
        tableData = widget.tableData ? JSON.parse(widget.tableData) : null;
      } catch (error) {
        console.error("Invalid table data JSON:", error);
        tableData = null;
      }

      // Default table data if none provided or invalid
      const defaultTableData = {
        headers: ["Name", "Age", "City", "Salary"],
        rows: [
          ["John Doe", "30", "New York", "$50,000"],
          ["Jane Smith", "25", "Los Angeles", "$45,000"],
          ["Bob Johnson", "35", "Chicago", "$60,000"],
          ["Alice Brown", "28", "Houston", "$55,000"],
        ],
      };

      const table = tableData || defaultTableData;

      return (
        <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 p-4 h-full overflow-auto transition-colors duration-300">
          <h3 className="font-bold text-lg mb-3 text-gray-800 dark:text-gray-200">
            {widget.tableTitle || "Sample Table"}
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border border-gray-300 dark:border-gray-600">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-700">
                  {table.headers.map((header, index) => (
                    <th
                      key={index}
                      className="border border-gray-300 dark:border-gray-600 px-3 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {table.rows.map((row, rowIndex) => (
                  <tr
                    key={rowIndex}
                    className={
                      rowIndex % 2 === 0
                        ? "bg-white dark:bg-gray-800"
                        : "bg-gray-50 dark:bg-gray-700"
                    }
                  >
                    {row.map((cell, cellIndex) => (
                      <td
                        key={cellIndex}
                        className="border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm text-gray-600 dark:text-gray-300"
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    case "button":
      return (
        <div className="w-full h-full flex items-center justify-center p-4">
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors duration-200 font-medium shadow-md hover:shadow-lg">
            {widget.content || "Click Me"}
          </button>
        </div>
      );
    case "weather":
      const [weatherData, setWeatherData] = useState(null);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);

      const fetchWeather = async () => {
        try {
          setLoading(true);
          setError(null);

          // Using wttr.in API which doesn't require API key
          const response = await fetch(`https://wttr.in/Bangalore?format=j1`);

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();

          // Extract weather data from wttr.in response
          const current = data.current_condition?.[0];
          if (!current) {
            throw new Error("Weather data format not recognized");
          }

          // Transform data to match our expected format
          const weatherData = {
            main: {
              temp: parseFloat(current.temp_C),
              humidity: parseInt(current.humidity),
            },
            weather: [
              {
                main: current.weatherDesc?.[0]?.value || "Unknown",
                id: current.weatherCode,
              },
            ],
            wind: {
              speed: parseFloat(current.windspeedKmph) / 3.6, // Convert km/h to m/s
            },
          };

          setWeatherData(weatherData);
        } catch (err) {
          console.error("Error fetching weather:", err);
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      useEffect(() => {
        fetchWeather();

        // Refresh weather every 30 minutes
        const interval = setInterval(fetchWeather, 30 * 60 * 1000);
        return () => clearInterval(interval);
      }, []);

      const getWeatherIcon = (weatherCode) => {
        // Map weather codes to emoji icons
        const weatherIcons = {
          "01": "☀️",
          "02": "⛅",
          "03": "☁️",
          "04": "☁️",
          "09": "🌧️",
          10: "🌦️",
          11: "⛈️",
          13: "🌨️",
          50: "🌫️",
        };

        const code = weatherCode?.toString().substring(0, 2);
        return weatherIcons[code] || "🌤️";
      };

      if (loading) {
        return (
          <div className="bg-gradient-to-br from-blue-400 to-blue-600 text-white p-3 h-full rounded-lg shadow-lg">
            <div className="text-center h-full flex flex-col justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mx-auto mb-2"></div>
              <div className="text-xs">Loading weather...</div>
            </div>
          </div>
        );
      }

      if (error) {
        return (
          <div className="bg-gradient-to-br from-blue-400 to-blue-600 text-white p-3 h-full rounded-lg shadow-lg">
            <div className="text-center h-full flex flex-col justify-center">
              <div className="text-3xl mb-1">🌤️</div>
              <h3 className="text-sm font-bold mb-1">Bangalore</h3>
              <div className="text-2xl font-bold mb-1">28°C</div>
              <div className="text-sm mb-2">Partly Cloudy</div>
              <div className="grid grid-cols-2 gap-1 text-xs mb-2">
                <div>Humidity: 65%</div>
                <div>Wind: 3 m/s</div>
              </div>
              <div className="text-xs opacity-75 mb-2">
                Sample data (API unavailable)
              </div>
              <button
                onClick={() => {
                  setError(null);
                  setLoading(true);
                  fetchWeather();
                }}
                className="px-2 py-1 bg-white bg-opacity-20 rounded text-xs hover:bg-opacity-30 transition-all"
              >
                Retry
              </button>
            </div>
          </div>
        );
      }

      const temp = weatherData?.main?.temp;
      const condition = weatherData?.weather?.[0]?.main;
      const humidity = weatherData?.main?.humidity;
      const windSpeed = weatherData?.wind?.speed;
      const weatherIcon = getWeatherIcon(weatherData?.weather?.[0]?.id);

      return (
        <div className="bg-gradient-to-br from-blue-400 to-blue-600 text-white p-3 h-full rounded-lg shadow-lg">
          <div className="text-center h-full flex flex-col justify-center">
            <div className="text-3xl mb-1">{weatherIcon}</div>
            <h3 className="text-sm font-bold mb-1">Bangalore</h3>
            <div className="text-2xl font-bold mb-1">
              {temp ? `${Math.round(temp)}°C` : "N/A"}
            </div>
            <div className="text-sm mb-2">{condition || "Unknown"}</div>
            <div className="grid grid-cols-2 gap-1 text-xs mb-1">
              <div>Humidity: {humidity ? `${humidity}%` : "N/A"}</div>
              <div>
                Wind: {windSpeed ? `${Math.round(windSpeed)} m/s` : "N/A"}
              </div>
            </div>
            <div className="text-xs opacity-75">
              Last updated: {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>
      );
    case "calendar":
      // Calendar state
      const [currentDate, setCurrentDate] = useState(new Date());
      const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth());
      const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());

      // Get days in month
      const getDaysInMonth = (month, year) => {
        return new Date(year, month + 1, 0).getDate();
      };

      // Get first day of month
      const getFirstDayOfMonth = (month, year) => {
        return new Date(year, month, 1).getDay();
      };

      // Navigate months
      const goToPreviousMonth = () => {
        if (currentMonth === 0) {
          setCurrentMonth(11);
          setCurrentYear(currentYear - 1);
        } else {
          setCurrentMonth(currentMonth - 1);
        }
      };

      const goToNextMonth = () => {
        if (currentMonth === 11) {
          setCurrentMonth(0);
          setCurrentYear(currentYear + 1);
        } else {
          setCurrentMonth(currentMonth + 1);
        }
      };

      // Generate calendar days
      const daysInMonth = getDaysInMonth(currentMonth, currentYear);
      const firstDayOfMonth = getFirstDayOfMonth(currentMonth, currentYear);
      const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];

      const calendarDays = [];

      // Add empty cells for days before the first day of the month
      for (let i = 0; i < firstDayOfMonth; i++) {
        calendarDays.push(
          <div key={`empty-${i}`} className="p-1 text-gray-400"></div>
        );
      }

      // Add days of the month
      for (let day = 1; day <= daysInMonth; day++) {
        const isToday =
          day === new Date().getDate() &&
          currentMonth === new Date().getMonth() &&
          currentYear === new Date().getFullYear();

        calendarDays.push(
          <div
            key={day}
            className={`p-1 text-center cursor-pointer text-xs ${
              isToday
                ? "bg-blue-500 text-white rounded"
                : "hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            <span>{day}</span>
          </div>
        );
      }

      return (
        <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 p-3 h-full transition-colors duration-300">
          <h3 className="font-bold text-lg mb-2 text-gray-800 dark:text-gray-200">
            {widget.title || "Calendar"}
          </h3>

          {/* Month Navigation */}
          <div className="flex justify-between items-center mb-3">
            <button
              onClick={goToPreviousMonth}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              {monthNames[currentMonth]} {currentYear}
            </div>
            <button
              onClick={goToNextMonth}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>

          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-0 mb-1">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div
                key={day}
                className="p-1 text-center text-xs font-medium text-gray-500 dark:text-gray-400"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-0">{calendarDays}</div>
        </div>
      );
    case "image":
      const [imageError, setImageError] = useState(false);

      const handleImageError = () => {
        setImageError(true);
      };

      return (
        <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 p-2 h-full transition-colors duration-300">
          {!imageError ? (
            <img
              src={widget.imageUrl || "https://picsum.photos/300/200"}
              alt={widget.altText || "Sample Image"}
              className="w-full h-3/4 object-cover rounded mb-2"
              onError={handleImageError}
            />
          ) : (
            <div className="w-full h-3/4 bg-gray-200 dark:bg-gray-700 rounded mb-2 flex items-center justify-center">
              <div className="text-center text-gray-500 dark:text-gray-400">
                <svg
                  className="w-12 h-12 mx-auto mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <p className="text-sm">Image not available</p>
              </div>
            </div>
          )}
          {widget.caption && (
            <p className="text-sm text-gray-600 dark:text-gray-300 text-center">
              {widget.caption}
            </p>
          )}
        </div>
      );
    case "rating":
      return (
        <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 p-4 h-full transition-colors duration-300">
          <h3 className="font-bold text-lg mb-3 text-gray-800 dark:text-gray-200 text-center">
            {widget.title || "Rate this product"}
          </h3>
          <div className="flex justify-center space-x-1">
            {[...Array(widget.maxRating || 5)].map((_, index) => (
              <button
                key={index}
                onClick={() => setRating(index + 1)}
                className={`text-2xl ${
                  index < rating
                    ? "text-yellow-400"
                    : "text-gray-300 dark:text-gray-600"
                } hover:text-yellow-400 transition-colors`}
              >
                ★
              </button>
            ))}
          </div>
          <div className="text-center mt-2 text-sm text-gray-600 dark:text-gray-300">
            {rating} out of {widget.maxRating || 5}
          </div>
        </div>
      );
    case "range-slider":
      return (
        <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 p-4 h-full transition-colors duration-300">
          <h3 className="font-bold text-lg mb-4 text-gray-800 dark:text-gray-200 text-center">
            {widget.title || "Volume Control"}
          </h3>
          <div className="flex flex-col items-center space-y-4">
            <div className="text-2xl font-bold text-gray-700 dark:text-gray-300">
              {sliderValue}
            </div>
            <input
              type="range"
              min={widget.min || 0}
              max={widget.max || 100}
              step={widget.step || 1}
              value={sliderValue}
              onChange={(e) => setSliderValue(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
            <div className="flex justify-between w-full text-xs text-gray-500 dark:text-gray-400">
              <span>{widget.min || 0}</span>
              <span>{widget.max || 100}</span>
            </div>
          </div>
        </div>
      );
    case "radio-group":
      let radioOptions;
      try {
        radioOptions = widget.options
          ? JSON.parse(widget.options)
          : ["Option 1", "Option 2", "Option 3", "Option 4"];
      } catch (error) {
        console.error("Invalid options JSON:", error);
        radioOptions = ["Option 1", "Option 2", "Option 3", "Option 4"];
      }

      return (
        <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 p-3 h-full transition-colors duration-300">
          <h3 className="font-bold text-sm mb-3 text-gray-800 dark:text-gray-200">
            {widget.title || "Select your preference"}
          </h3>
          <div className="space-y-1">
            {radioOptions.map((option, index) => (
              <label
                key={index}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <input
                  type="radio"
                  name={`radio-${widget.id}`}
                  value={option}
                  checked={selectedRadio === option}
                  onChange={(e) => setSelectedRadio(e.target.value)}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-xs text-gray-700 dark:text-gray-300 truncate">
                  {option}
                </span>
              </label>
            ))}
          </div>
          <div className="mt-2 text-xs text-gray-600 dark:text-gray-400 truncate">
            Selected: {selectedRadio}
          </div>
        </div>
      );
    case "microphone":
      return (
        <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 p-4 h-full transition-colors duration-300">
          <h3 className="font-bold text-lg mb-4 text-gray-800 dark:text-gray-200 text-center">
            {widget.title || "Voice Recorder"}
          </h3>
          <div className="flex flex-col items-center space-y-4">
            <button
              onClick={() => setIsRecording(!isRecording)}
              className={`w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl transition-all ${
                isRecording
                  ? "bg-red-500 hover:bg-red-600 animate-pulse"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
            >
              {isRecording ? "⏹️" : "🎤"}
            </button>
            <div className="text-lg font-mono text-gray-700 dark:text-gray-300">
              {formatTime(recordingTime)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 text-center">
              {isRecording ? "Recording..." : "Click to start recording"}
            </div>
          </div>
        </div>
      );
    default:
      return null;
  }
}
