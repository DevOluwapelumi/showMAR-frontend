import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import ThemeProvider from './context/ThemeProvider'
import { Toaster } from 'react-hot-toast'
import { registerSW } from 'virtual:pwa-register'


registerSW({
  onNeedRefresh() {
    if (confirm("New content available. Refresh?")) {
      window.location.reload()
    }
  },
  onOfflineReady() {
    console.log("App is ready to work offline")
  },
})


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
    <App />
    </ThemeProvider>
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
  </React.StrictMode>,
)
