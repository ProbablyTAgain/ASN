import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App';
import { supabase } from './lib/supabase';
import './index.css';

function renderApp() {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <HashRouter>
        <App />
      </HashRouter>
    </React.StrictMode>
  );
}

// Supabase's OAuth redirect puts the session in the URL as a hash fragment
// (#access_token=...), which HashRouter would otherwise misread as a route
// and 404 on, racing Supabase's own parsing of that same hash. Waiting for
// getSession() first lets Supabase consume and clean up the hash before
// HashRouter ever looks at it.
supabase.auth.getSession().finally(renderApp);
