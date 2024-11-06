import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const API_BASE_URL = "https://paytm-backend-atpg.onrender.com";

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
  const itemsPerPage = 3;

  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Hardcoded credentials
  const predefinedUsername = "kesava";
  const predefinedPassword = "bhanu@123";

  // Fetch data if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const fetchData = async () => {
        try {
          const counterRes = await axios.get(`${API_BASE_URL}/api/counters`);
          const textArrayRes = await axios.get(`${API_BASE_URL}/api/entries`);
          setCounters(counterRes.data);
          setTextArray(textArrayRes.data);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
      fetchData();
    }
  }, [isAuthenticated]);

  const updateCounter = async (counter, change) => {
    try {
      const newValue = counters[counter] + change;
      if (newValue < 0) return; // Prevents negative values

      await axios.put(`${API_BASE_URL}/api/counters/${counter}`, { value: newValue });

      setCounters((prevCounters) => ({
        ...prevCounters,
        [counter]: newValue,
      }));
    } catch (error) {
      console.error("Error updating counter:", error);
    }
  };

  const handleTextSubmit = async () => {
    if (textInput.trim()) {
      try {
        await axios.post(`${API_BASE_URL}/api/entries`, { text: textInput });
        const textArrayRes = await axios.get(`${API_BASE_URL}/api/entries`);
        setTextArray(textArrayRes.data);
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

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === predefinedUsername && password === predefinedPassword) {
      setIsAuthenticated(true);
    } else {
      alert("Incorrect username or password.");
    }
  };

  // If not authenticated, show login form
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 flex items-center justify-center w-screen">
        <div className="max-w-sm w-full bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Login</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="p-3 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-300"
              placeholder="Username"
              required
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="p-3 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-300"
              placeholder="Password"
              required
            />
            <button
              type="submit"
              className="w-full bg-teal-500 text-white py-3 rounded-lg hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-300"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  // If authenticated, show the dashboard
  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 p-6 w-screen">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-2xl p-6">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Counter Dashboard</h1>

        {/* Counters Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {Object.entries(counters)
            .filter(([key]) => key !== '_id' && key !== '__v')
            .map(([counter, value]) => (
              <div key={counter} className="bg-gradient-to-r from-teal-400 to-blue-500 p-6 rounded-lg shadow-lg text-center">
                <h2 className="text-lg font-semibold text-white mb-3">{counter}</h2>
                <p className="text-3xl font-extrabold text-white">{value}</p>
                <div className="flex flex-col space-y-2 lg:flex-col items-center justify-center mt-4">
                  <button
                    onClick={() => updateCounter(counter, 1)}
                    className="bg-teal-500 text-white py-2 px-4 md:px-6 rounded-full hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-300 text-sm md:text-base w-full lg:w-auto"
                  >
                    Increment
                  </button>
                  <button
                    onClick={() => updateCounter(counter, -1)}
                    className="bg-red-500 text-white py-2 px-4 md:px-6 rounded-full hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300 text-sm md:text-base w-full lg:w-auto"
                  >
                    Decrement
                  </button>
                </div>
              </div>
            ))}
        </div>

        {/* Text Input Section */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Add a New Entry</h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              className="p-3 w-full sm:w-2/3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-300"
              placeholder="Enter new entry"
            />
            <button
              onClick={handleTextSubmit}
              className="w-full sm:w-1/3 bg-teal-500 text-white py-3 rounded-lg hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-300"
            >
              Add Entry
            </button>
          </div>
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
          <div className="flex justify-center items-center mt-6 space-x-4">
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

export default App;
