import React from 'react';
import ReactDOM from 'react-dom';
import './index.css'; // Import the CSS file
import App from './App'; // Import the App component
import reportWebVitals from './reportWebVitals'; // Import the reportWebVitals function

// Render the App component inside the 'root' div in the index.html file
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// Optionally, you can log web vitals if you keep the reportWebVitals functionality
reportWebVitals();
