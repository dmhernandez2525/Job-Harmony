import React from 'react';
import LoginFormContainer from '../session/login_form_container';
import SignupFormContainer from '../session/signup_form_container';
import DemoRoleSelector from '../../demo/components/DemoRoleSelector';
import { isDemoModeEnabled } from '../../demo/demoData';

function Modal({ modal, closeModal }) {
  if (!modal) {
    return null;
  }

  // Check if demo mode is enabled
  const demoMode = isDemoModeEnabled();

  let component;
  switch (modal) {
    case 'login':
      // In demo mode, show role selector instead of login form
      component = demoMode
        ? <DemoRoleSelector onClose={closeModal} />
        : <LoginFormContainer />;
      break;
    case 'signup':
      // In demo mode, show role selector instead of signup form
      component = demoMode
        ? <DemoRoleSelector onClose={closeModal} />
        : <SignupFormContainer />;
      break;
    case 'demo':
      component = <DemoRoleSelector onClose={closeModal} />;
      break;
    default:
      return null;
  }
  return (
    <div className="modal-background" onClick={closeModal}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        {component}
      </div>
    </div>
  );
}

export default Modal;
