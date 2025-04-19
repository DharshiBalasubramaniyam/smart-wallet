import React from 'react'
import { StrictMode } from 'react'
import { Container, createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google'

createRoot(document.getElementById('root') as Container).render(
  // <StrictMode>
  <GoogleOAuthProvider clientId="1086892347870-srucof6knmfglgg1kbje8185s2875ipo.apps.googleusercontent.com">
    <App />
  </GoogleOAuthProvider>
  // </StrictMode>,
)

// 1086892347870-srucof6knmfglgg1kbje8185s2875ipo.apps.googleusercontent.com
