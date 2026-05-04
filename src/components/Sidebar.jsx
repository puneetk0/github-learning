import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Terminal, 
  GitCommit, 
  GitBranch, 
  GitMerge, 
  RotateCcw, 
  Settings,
  BookOpen,
  Box,
  Layers,
  Cpu,
  ShieldAlert,
  GitPullRequest,
  Network,
  ListChecks
} from 'lucide-react';
import './Sidebar.css';

export default function Sidebar() {
  const links = [
    { path: '/intro', icon: <BookOpen />, label: '1. Why Git & GitHub?', section: 'Introduction' },
    { path: '/setup', icon: <Settings />, label: '2. Setup & Config', section: 'Introduction' },
    
    { path: '/mental-models', icon: <Box />, label: '3. Core Concepts', section: 'Fundamentals' },
    { path: '/internals', icon: <Cpu />, label: '4. Internals', section: 'Fundamentals' },
    { path: '/essentials', icon: <Terminal />, label: '5. Essential Commands', section: 'Fundamentals' },
    
    { path: '/branching', icon: <GitBranch />, label: '6. Branching & Merging', section: 'Collaboration' },
    { path: '/conflicts', icon: <GitMerge />, label: '7. Merge Conflicts', section: 'Collaboration' },
    
    { path: '/advanced', icon: <Layers />, label: '8. Advanced Git', section: 'Mastery' },
    { path: '/undo', icon: <RotateCcw />, label: '9. Undoing Things', section: 'Mastery' },
    
    { path: '/github-features', icon: <GitPullRequest />, label: '10. GitHub Features', section: 'Ecosystem' },
    { path: '/workflows', icon: <Network />, label: '11. Real-World Workflows', section: 'Ecosystem' },
    
    { path: '/best-practices', icon: <ShieldAlert />, label: '12. Best Practices', section: 'Reference' },
    { path: '/startup-pr', icon: <GitCommit />, label: '13. Your First PR', section: 'Reference' },
    { path: '/cheatsheet', icon: <ListChecks />, label: '14. Cheatsheet', section: 'Reference' },
  ];

  let currentSection = '';

  return (
    <nav id="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <GitBranch size={24} color="var(--accent)" />
          <div className="sidebar-logo-text">Git Mastery</div>
        </div>
      </div>
      <div className="sidebar-nav">
        {links.map((link) => {
          const isNewSection = link.section !== currentSection;
          currentSection = link.section;
          
          return (
            <React.Fragment key={link.path}>
              {isNewSection && <div className="nav-group-label">{link.section}</div>}
              <NavLink 
                to={link.path} 
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              >
                {link.icon}
                {link.label}
              </NavLink>
            </React.Fragment>
          );
        })}
      </div>
    </nav>
  );
}
