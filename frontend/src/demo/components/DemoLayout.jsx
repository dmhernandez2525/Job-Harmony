import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useDemoContext, DEMO_ROLES } from '../DemoContext';
import DemoNavbar from './DemoNavbar';
import DemoEmployerNavbar from './DemoEmployerNavbar';
import DemoBottomNav from './DemoBottomNav';

const DemoLayout = () => {
  const { demoRole, isEnvDemoMode } = useDemoContext();
  const navigate = useNavigate();

  // If no role is selected and we're on a demo page, redirect to home
  // to show the role selector modal
  useEffect(() => {
    if (!demoRole && isEnvDemoMode) {
      // Role hasn't been selected yet, stay on demo page
      // The navbar will show the role selector
    } else if (!demoRole && !isEnvDemoMode) {
      // Demo mode not enabled and no role selected
      navigate('/');
    }
  }, [demoRole, isEnvDemoMode, navigate]);

  // Show appropriate navbar based on role
  const NavbarComponent = demoRole === DEMO_ROLES.EMPLOYER
    ? DemoEmployerNavbar
    : DemoNavbar;

  // If no role selected yet, show a role selection prompt
  if (!demoRole) {
    return (
      <div className="demo-layout">
        <div className="demo-role-prompt">
          <h2>Select a Demo Role</h2>
          <p>Please select a role from the login/signup modal to continue.</p>
          <button
            className="btn-primary"
            onClick={() => navigate('/')}
          >
            Go Back to Home
          </button>
        </div>
        <style>{`
          .demo-role-prompt {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 50vh;
            padding: 2rem;
            text-align: center;
          }

          .demo-role-prompt h2 {
            margin-bottom: 1rem;
            color: #1a1a2e;
          }

          .demo-role-prompt p {
            color: #666;
            margin-bottom: 2rem;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="demo-layout">
      <NavbarComponent />
      <main className="demo-content">
        <Outlet />
      </main>
      <DemoBottomNav />
      <style>{`
        .demo-layout {
          min-height: 100vh;
          background: #f5f5f5;
        }

        .demo-content {
          padding-top: 1rem;
          padding-bottom: 5rem;
        }

        @media (min-width: 768px) {
          .demo-content {
            padding-bottom: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default DemoLayout;
