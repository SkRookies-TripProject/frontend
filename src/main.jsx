import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import "./app.css";
import './style.css';
import { BrowserRouter } from 'react-router-dom';

createRoot(document.getElementById("root")).render(
  <App />
);
