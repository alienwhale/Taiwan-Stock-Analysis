import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// Storage API polyfill for non-Claude environments
if (typeof window !== 'undefined' && !window.storage) {
  const store = {};
  window.storage = {
    set: async (key, value) => { store[key] = value; return { key, value }; },
    get: async (key) => store[key] ? { key, value: store[key] } : null,
    delete: async (key) => { delete store[key]; return { key, deleted: true }; },
    list: async (prefix = '') => ({
      keys: Object.keys(store).filter(k => k.startsWith(prefix))
    })
  };
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
