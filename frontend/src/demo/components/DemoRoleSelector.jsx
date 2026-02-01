import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDemoContext, DEMO_ROLES } from '../DemoContext';

const DemoRoleSelector = ({ onClose }) => {
  const { selectRole } = useDemoContext();
  const navigate = useNavigate();

  const handleRoleSelect = (role) => {
    selectRole(role);
    if (onClose) {
      onClose();
    }
    // Navigate to the appropriate demo page based on role
    if (role === DEMO_ROLES.EMPLOYER) {
      navigate('/demo/employer');
    } else {
      navigate('/demo');
    }
  };

  return (
    <div className="demo-role-selector">
      <div className="demo-role-header">
        <h2>Welcome to Job-Harmony Demo</h2>
        <p>Experience the platform from different perspectives</p>
        <span className="demo-badge">Demo Mode</span>
      </div>

      <div className="demo-roles-container">
        <button
          className="demo-role-card"
          onClick={() => handleRoleSelect(DEMO_ROLES.CANDIDATE)}
        >
          <div className="role-icon candidate-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <h3>Job Seeker</h3>
          <p>Browse jobs, swipe to match, and track applications</p>
          <ul className="role-features">
            <li>Browse curated job listings</li>
            <li>Swipe to express interest</li>
            <li>View matches and applications</li>
            <li>Manage your resume</li>
          </ul>
        </button>

        <button
          className="demo-role-card"
          onClick={() => handleRoleSelect(DEMO_ROLES.EMPLOYER)}
        >
          <div className="role-icon employer-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            </svg>
          </div>
          <h3>Employer</h3>
          <p>Post jobs, review candidates, and manage applications</p>
          <ul className="role-features">
            <li>View incoming applications</li>
            <li>Review candidate profiles</li>
            <li>Track matched candidates</li>
            <li>Manage job listings</li>
          </ul>
        </button>
      </div>

      <div className="demo-note">
        <p>
          This is a demo environment with sample data.
          No real accounts or data will be affected.
        </p>
      </div>

      <style>{`
        .demo-role-selector {
          padding: 2rem;
          max-width: 600px;
          margin: 0 auto;
        }

        .demo-role-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .demo-role-header h2 {
          font-size: 1.75rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          color: #1a1a2e;
        }

        .demo-role-header p {
          color: #666;
          margin-bottom: 1rem;
        }

        .demo-badge {
          display: inline-block;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .demo-roles-container {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        @media (max-width: 480px) {
          .demo-roles-container {
            grid-template-columns: 1fr;
          }
        }

        .demo-role-card {
          background: white;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          padding: 1.5rem;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .demo-role-card:hover {
          border-color: #667eea;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
          transform: translateY(-2px);
        }

        .role-icon {
          width: 3rem;
          height: 3rem;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1rem;
        }

        .role-icon svg {
          width: 1.5rem;
          height: 1.5rem;
        }

        .candidate-icon {
          background: #e0f2fe;
          color: #0284c7;
        }

        .employer-icon {
          background: #fef3c7;
          color: #d97706;
        }

        .demo-role-card h3 {
          font-size: 1.125rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: #1a1a2e;
        }

        .demo-role-card > p {
          font-size: 0.875rem;
          color: #666;
          margin-bottom: 1rem;
        }

        .role-features {
          list-style: none;
          padding: 0;
          margin: 0;
          text-align: left;
          width: 100%;
        }

        .role-features li {
          font-size: 0.75rem;
          color: #666;
          padding: 0.25rem 0;
          padding-left: 1rem;
          position: relative;
        }

        .role-features li::before {
          content: "\\2713";
          position: absolute;
          left: 0;
          color: #10b981;
          font-weight: bold;
        }

        .demo-note {
          text-align: center;
          padding: 1rem;
          background: #f3f4f6;
          border-radius: 8px;
        }

        .demo-note p {
          font-size: 0.75rem;
          color: #666;
          margin: 0;
        }
      `}</style>
    </div>
  );
};

export default DemoRoleSelector;
