import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { createRoot } from 'react-dom/client'
import { Auth0Provider } from '@auth0/auth0-react'

ReactDOM.createRoot(document.getElementById('root')).render(
    <Auth0Provider
        domain="dev-an4h3iea72pdgq3t.uk.auth0.com"
        clientId="hcWJNDZjahpcgLyZ5GJUcvYufJcAzzqI"
        authorizationParams={{
            redirect_uri: window.location.origin,
            audience: 'http:resto-api'
        }}
    >
  <React.StrictMode>
    <App />
  </React.StrictMode>
    </Auth0Provider>,
)
