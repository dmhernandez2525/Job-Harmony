import React from 'react';
import { AuthRoute, ProtectedRoute } from '../util/route_util';
import { Routes, Route } from 'react-router-dom';
import NavBarContainer from './nav/navbar_container';
import ModalContainer from './modal/modal_container';
import MatchesContainer from './matches/match_index_container';
import MainPage from './main/main_page';
import UserShowContainer from './users/user_show_container';
import CreateResumeFormContainer from './resume/create_resume_form_container';
import EditResumeFormContainer from './resume/edit_resume_form_container';
import ResumeShowContainer from './resume/resume_show_container';
import CreateOnePageFormContainer from './onePage/create_onepage_form_container';
import EditOnePageFormContainer from './onePage/edit_onepage_form_container';
import OnePageShowContainer from './onePage/onepage_show_container';
import SplashContainer from './splash/splash_container';
import PreferencesFormContainer from './preferences/preferences_form_container';

// Demo components
import { DemoProvider } from '../demo/DemoContext';
import DemoLayout from '../demo/components/DemoLayout';
import DemoMainPage from '../demo/pages/DemoMainPage';
import DemoMatchesPage from '../demo/pages/DemoMatchesPage';
import DemoApplicationsPage from '../demo/pages/DemoApplicationsPage';
import DemoProfilePage from '../demo/pages/DemoProfilePage';
import DemoResumePage from '../demo/pages/DemoResumePage';
import DemoEmployerDashboard from '../demo/pages/DemoEmployerDashboard';
import DemoEmployerApplicationsPage from '../demo/pages/DemoEmployerApplicationsPage';
import DemoEmployerCandidatesPage from '../demo/pages/DemoEmployerCandidatesPage';

const App = () => (
  <DemoProvider>
    <div>
      <NavBarContainer />
      <ModalContainer />
      <Routes>
        {/* Marketing/Auth routes */}
        <Route path="/" element={<AuthRoute element={<SplashContainer />} />} />

        {/* Protected routes (require real auth) */}
        <Route path="/matches" element={<ProtectedRoute element={<MatchesContainer />} />} />
        <Route path="/preferences" element={<ProtectedRoute element={<PreferencesFormContainer />} />} />
        <Route path="/users/:userId/profile" element={<ProtectedRoute element={<UserShowContainer />} />} />
        <Route path="/home" element={<ProtectedRoute element={<MainPage />} />} />
        <Route path="/resumes/new" element={<ProtectedRoute element={<CreateResumeFormContainer />} />} />
        <Route path="/resumes/:resumeId" element={<ProtectedRoute element={<ResumeShowContainer />} />} />
        <Route path="/resumes/:resumeId/edit" element={<ProtectedRoute element={<EditResumeFormContainer />} />} />
        <Route path="/onePages/new" element={<ProtectedRoute element={<CreateOnePageFormContainer />} />} />
        <Route path="/onePages/:onePageId" element={<ProtectedRoute element={<OnePageShowContainer />} />} />
        <Route path="/onePages/:onePageId/edit" element={<ProtectedRoute element={<EditOnePageFormContainer />} />} />

        {/* Demo routes - no auth required */}
        <Route path="/demo" element={<DemoLayout />}>
          <Route index element={<DemoMainPage />} />
          <Route path="matches" element={<DemoMatchesPage />} />
          <Route path="applications" element={<DemoApplicationsPage />} />
          <Route path="profile" element={<DemoProfilePage />} />
          <Route path="resume" element={<DemoResumePage />} />
          {/* Employer demo routes */}
          <Route path="employer" element={<DemoEmployerDashboard />} />
          <Route path="employer/applications" element={<DemoEmployerApplicationsPage />} />
          <Route path="employer/candidates" element={<DemoEmployerCandidatesPage />} />
        </Route>
      </Routes>
    </div>
  </DemoProvider>
);

export default App;
