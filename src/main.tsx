import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { PaletteProvider } from './context/PaletteContext'
import './index.css'
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode><PaletteProvider><App /></PaletteProvider></React.StrictMode>,
)
