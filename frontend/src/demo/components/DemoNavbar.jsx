import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDemoContext } from '../DemoContext';
import logo from '../../images/jobHarmonyLogo.png';

const DemoNavbar = () => {
  const { user } = useDemoContext();
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

  const exitDemo = () => {
    navigate('/');
  };

  return (
    <div className="nav-bar-user">
      <div className="navbar-left">
        <Link className="nav-image" to="/demo">
          <img className="nav-image" src={logo} alt="Job Harmony Logo" />
        </Link>
        <span className="badge-primary ml-2 text-xs">DEMO MODE</span>
      </div>
      <div className="navbar-right">
        <Link to="/demo/profile">
          <button className="session-btn my-profile-btn">My Profile</button>
        </Link>
        <Link to="/demo/matches">
          <button className="session-btn my-matches-btn">My Matches</button>
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
                  <Link to="/demo">Browse Jobs</Link>
                </button>
              </li>
              <li className="drop-list-item">
                <button className="logout-btn">
                  <Link to="/demo/profile">Profile</Link>
                </button>
              </li>
              <li className="drop-list-item">
                <button className="logout-btn">
                  <Link to="/demo/applications">Applications</Link>
                </button>
              </li>
              <li className="drop-list-item">
                <button className="logout-btn">
                  <Link to="/demo/resume">Resume</Link>
                </button>
              </li>
              <li className="drop-list-item">
                <button className="logout-btn" onClick={exitDemo}>
                  Exit Demo
                </button>
              </li>
            </span>
          </div>
        </ul>
      </div>
    </div>
  );
};

export default DemoNavbar;
