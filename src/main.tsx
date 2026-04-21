import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { registerSW } from 'virtual:pwa-register'
import { ThemePreviewBar } from './components/ThemePreviewBar'
import './index.css'
import App from './App.tsx'
import { InstallGuidePage } from './pages/InstallGuidePage.tsx'
import { ThemeProvider } from './ThemeContext'

registerSW({ immediate: true })

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <ThemePreviewBar />
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/install" element={<InstallGuidePage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
)
