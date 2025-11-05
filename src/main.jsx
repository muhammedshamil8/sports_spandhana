import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './Router.jsx'
import { BrowserRouter as Router } from 'react-router-dom';
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
      <App />
  </React.StrictMode>,
);
