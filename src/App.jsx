import React, { useState, useEffect, useRef } from "react";
import "./App.css";

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
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const itemRef = useRef(null);

  useEffect(() => {
    const savedCounters = JSON.parse(localStorage.getItem("counters"));
    const savedTextArray = JSON.parse(localStorage.getItem("textArray"));
    if (savedCounters) setCounters(savedCounters);
    if (savedTextArray) setTextArray(savedTextArray);
  }, []);

  useEffect(() => {
    localStorage.setItem("counters", JSON.stringify(counters));
  }, [counters]);

  useEffect(() => {
    localStorage.setItem("textArray", JSON.stringify(textArray));
  }, [textArray]);

  useEffect(() => {
    if (itemRef.current) {
      const itemHeight = itemRef.current.clientHeight;
      const maxItems = Math.floor(window.innerHeight / itemHeight);
      setItemsPerPage(maxItems);
    }
  }, [textArray]);

  const updateCounter = (counter, change) => {
    setCounters((prevCounters) => {
      const newValue = prevCounters[counter] + change;
      return {
        ...prevCounters,
        [counter]: newValue < 0 ? 0 : newValue,
      };
    });
  };

  const handleTextSubmit = () => {
    if (textInput.trim()) {
      const updatedArray = [textInput, ...textArray].slice(0, 50);
      setTextArray(updatedArray);
      setTextInput("");
      setCurrentPage(1);
    }
  };

  const displayedTextArray = textArray.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="app-container">
      <div className="dashboard">
        <h1 className="dashboard-title">Counter Dashboard</h1>

        <div className="counters-container">
          <Counter
            label="Completed"
            count={counters.completed}
            onIncrement={() => updateCounter("completed", 1)}
            onDecrement={() => updateCounter("completed", -1)}
          />

          <Counter
            label="Half-Completed"
            count={counters.halfCompleted}
            onIncrement={() => updateCounter("halfCompleted", 1)}
            onDecrement={() => updateCounter("halfCompleted", -1)}
          />

          <Counter
            label="Registered-NoPayment"
            count={counters.registeredNoPayment}
            onIncrement={() => updateCounter("registeredNoPayment", 1)}
            onDecrement={() => updateCounter("registeredNoPayment", -1)}
          />

          <Counter
            label="Wasted"
            count={counters.wasted}
            onIncrement={() => updateCounter("wasted", 1)}
            onDecrement={() => updateCounter("wasted", -1)}
          />
        </div>

        <div className="input-container">
          <input
            type="text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            className="text-input"
            placeholder="Enter text"
          />
          <button onClick={handleTextSubmit} className="submit-button">
            Add Text
          </button>
        </div>
      </div>

      <div className="entries-container">
        <h2 className="entries-title">Latest Entries</h2>
        {displayedTextArray.length > 0 ? (
          <ul className="entries-list">
            {displayedTextArray.map((text, index) => (
              <li key={index} className="entry-item" ref={index === 0 ? itemRef : null}>
                {text}
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-entries">No entries yet.</p>
        )}

        <div className="pagination">
          {Array(Math.ceil(textArray.length / itemsPerPage))
            .fill()
            .map((_, index) => (
              <button
                key={index}
                onClick={() => handlePageChange(index + 1)}
                className={`page-button ${
                  currentPage === index + 1 ? "active-page" : ""
                }`}
              >
                {index + 1}
              </button>
            ))}
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
