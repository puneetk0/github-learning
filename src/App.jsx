import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Intro from './pages/Intro';
import Setup from './pages/Setup';
import MentalModels from './pages/MentalModels';
import Internals from './pages/Internals';
import Essentials from './pages/Essentials';
import Branching from './pages/Branching';
import Conflicts from './pages/Conflicts';
import Advanced from './pages/Advanced';
import Undo from './pages/Undo';
import GithubFeatures from './pages/GithubFeatures';
import Workflows from './pages/Workflows';
import BestPractices from './pages/BestPractices';
import StartupPR from './pages/StartupPR';
import Cheatsheet from './pages/Cheatsheet';
import GitDarkArts from './pages/DarkArts';

import './App.css';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className={`app-container ${isSidebarOpen ? '' : 'sidebar-closed'}`}>
      <ScrollToTop />
      <Sidebar isOpen={isSidebarOpen} />
      <main className="main-content">
        <button 
          className="sidebar-toggle-btn" 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          title="Toggle Sidebar"
        >
          <Menu size={20} />
        </button>
        <Routes>
          <Route path="/" element={<Navigate to="/intro" replace />} />
          <Route path="/intro" element={<Intro />} />
          <Route path="/setup" element={<Setup />} />
          <Route path="/mental-models" element={<MentalModels />} />
          <Route path="/internals" element={<Internals />} />
          <Route path="/essentials" element={<Essentials />} />
          <Route path="/branching" element={<Branching />} />
          <Route path="/conflicts" element={<Conflicts />} />
          <Route path="/advanced" element={<Advanced />} />
          <Route path="/undo" element={<Undo />} />
          <Route path="/github-features" element={<GithubFeatures />} />
          <Route path="/workflows" element={<Workflows />} />
          <Route path="/best-practices" element={<BestPractices />} />
          <Route path="/startup-pr" element={<StartupPR />} />
          <Route path="/cheatsheet" element={<Cheatsheet />} />
          <Route path="/dark-arts" element={<GitDarkArts />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
