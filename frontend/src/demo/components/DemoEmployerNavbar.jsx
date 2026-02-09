import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDemoContext } from '../DemoContext';
import logo from '../../images/jobHarmonyLogo.png';

const DemoEmployerNavbar = () => {
  const { user, exitDemo } = useDemoContext();
  const [dropdown, setDropdown] = useState('dropdown-hidden');
  const containerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setDropdown('dropdown-hidden');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = () => {
    setDropdown(prev =>
      prev === 'dropdown-hidden' ? 'dropdown-visible' : 'dropdown-hidden'
    );
  };

  const handleExitDemo = () => {
    exitDemo();
    navigate('/');
  };

  return (
    <div className="nav-bar-user demo-navbar-desktop">
      <div className="navbar-left">
        <Link className="nav-image" to="/demo/employer">
          <img className="nav-image" src={logo} alt="Job Harmony Logo" />
        </Link>
        <span className="badge-employer ml-2 text-xs">EMPLOYER DEMO</span>
      </div>
      <div className="navbar-right">
        <Link to="/demo/employer">
          <button className="session-btn my-profile-btn">Dashboard</button>
        </Link>
        <Link to="/demo/employer/applications">
          <button className="session-btn my-matches-btn">Applications</button>
        </Link>
        <Link to="/demo/employer/candidates">
          <button className="session-btn">Candidates</button>
        </Link>
        <div className="user-name-bar" onClick={toggleDropdown}>
          <span className="username-btn">{user.fName}</span>
          <i className="down"></i>
        </div>
        <ul id="dropdown" className={dropdown}>
          <div className="container" ref={containerRef}>
            <span onClick={toggleDropdown} className="dropdown-items">
              <li className="drop-list-item">
                <button className="logout-btn">
                  <Link to="/demo/employer">Dashboard</Link>
                </button>
              </li>
              <li className="drop-list-item">
                <button className="logout-btn">
                  <Link to="/demo/employer/applications">Applications</Link>
                </button>
              </li>
              <li className="drop-list-item">
                <button className="logout-btn">
                  <Link to="/demo/employer/candidates">Candidates</Link>
                </button>
              </li>
              <li className="drop-list-item">
                <button className="logout-btn" onClick={handleExitDemo}>
                  Exit Demo
                </button>
              </li>
            </span>
          </div>
        </ul>
      </div>
      <style>{`
        .badge-employer {
          display: inline-block;
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-left: 0.5rem;
        }
      `}</style>
    </div>
  );
};

export default DemoEmployerNavbar;
