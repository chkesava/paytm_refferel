import React, { useState, useEffect } from "react";
import axios from "axios"; // Import axios
import Pagination from "@mui/material/Pagination"; // Import Pagination from Material-UI
import Skeleton from "@mui/material/Skeleton"; // Import Skeleton loader
import "./App.css";

const API_BASE_URL = "https://paytm-backend-atpg.onrender.com"; // Your backend base URL

function App() {
  const [counters, setCounters] = useState({
    completed: 0,
    halfCompleted: 0,
    registeredNoPayment: 0,
    wasted: 0,
  });
  const [textInput, setTextInput] = useState("");
  const [textArray, setTextArray] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true); // Loading state for API calls
  const itemsPerPage = 5;

  // Load counters and text array from the backend on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Set loading to true before API calls
      try {
        const counterRes = await axios.get(`${API_BASE_URL}/api/counters`);
        const res = counterRes.data;
        const textArrayRes = await axios.get(`${API_BASE_URL}/api/entries`);
        setCounters(counterRes.data);
        setTextArray(textArrayRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      setLoading(false); // Set loading to false after API calls
    };
    fetchData();
  }, []);

  // Update counters in the backend
  const updateCounter = async (counter, change) => {
    try {
      const newValue = counters[counter] + change;
      const updatedCounters = { ...counters, [counter]: newValue < 0 ? 0 : newValue };
      await axios.put(`${API_BASE_URL}/api/counters/${counter}`, { value: updatedCounters[counter] }); // Update on backend
      setCounters(updatedCounters); // Update local state
    } catch (error) {
      console.error("Error updating counter:", error);
    }
  };

  // Add text input to the backend and update text array
  const handleTextSubmit = async () => {
    if (textInput.trim()) {
      try {
        const updatedArray = [textInput, ...textArray].slice(0, 50);
        await axios.post(`${API_BASE_URL}/api/entries`, { text: textInput }); // Add new text to backend
        setTextArray(updatedArray); // Update local state
        setTextInput("");
        setCurrentPage(1);
      } catch (error) {
        console.error("Error adding text:", error);
      }
    }
  };

  const displayedTextArray = textArray.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 p-6 w-screen">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-2xl p-6">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Counter Dashboard</h1>
        
        {/* Counters Section */}
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4 mb-6">
          {Object.entries(counters)
            .filter(([key]) => key !== '_id' && key !== '__v') // Filter out _id and __v
            .map(([counter, value]) => (
              <div key={counter} className="bg-gradient-to-r from-teal-400 to-blue-500 p-6 rounded-lg shadow-lg text-center">
                <h2 className="text-lg font-semibold text-white mb-3">{counter}</h2>
                <p className="text-3xl font-extrabold text-white">{value}</p>
                <button
                  onClick={() => updateCounter(counter, value + 1)}
                  className="mt-4 bg-teal-500 text-white py-2 px-6 rounded-full hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-300"
                >
                  Increment
                </button>
              </div>
            ))}
        </div>
        
        {/* Entries Section */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6 shadow-xl">
          <h2 className="text-xl font-semibold mb-6 text-gray-800">Entries</h2>
          <ul className="space-y-4">
            {displayedTextArray.map((entry) => (
              <li key={entry._id} className="bg-white p-4 rounded-lg shadow-lg transition-transform transform hover:scale-105 duration-300 ease-in-out">
                <p className="text-lg text-gray-800">{entry.text}</p>
              </li>
            ))}
          </ul>
          
          {/* Pagination */}
          <div className="flex justify-center mt-6">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-5 py-2 bg-teal-500 text-white rounded-full hover:bg-teal-600 disabled:opacity-50 transition-colors"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-lg text-gray-700">
              Page {currentPage}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage * itemsPerPage >= textArray.length}
              className="px-5 py-2 bg-teal-500 text-white rounded-full hover:bg-teal-600 disabled:opacity-50 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Counter({ label, count, onIncrement, onDecrement }) {
  return (
    <div className="counter">
      <span className="counter-label">{label}</span>
      <div className="counter-controls">
        <button onClick={onDecrement} className="counter-button decrement">
          -1
        </button>
        <span className="counter-value">{count}</span>
        <button onClick={onIncrement} className="counter-button increment">
          +1
        </button>
      </div>
    </div>
  );
}

export default App;
