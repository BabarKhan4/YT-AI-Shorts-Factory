import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { SetupWizard } from './components/SetupWizard';
import { Dashboard } from './components/Dashboard';
import { Settings } from './types';

export default function App() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      setSettings(data);
    } catch (e) {
      console.error("Failed to load settings", e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-slate-950">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  return (
    <Router>
      <Routes>
        <Route 
          path="/setup" 
          element={settings?.isSetupComplete ? <Navigate to="/" /> : <SetupWizard onComplete={fetchSettings} />} 
        />
        <Route 
          path="/*" 
          element={!settings?.isSetupComplete ? <Navigate to="/setup" /> : <Dashboard settings={settings} />} 
        />
      </Routes>
    </Router>
  );
}
