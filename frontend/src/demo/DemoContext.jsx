import React, { createContext, useContext, useState, useCallback } from 'react';
import {
  isDemoModeEnabled,
  demoCandidateUser,
  demoEmployerUser,
  demoUser,
  demoResume,
  demoJobListings,
  demoLikedJobs,
  demoMatches,
  demoApplications,
  demoCandidates,
  demoReceivedApplications,
  demoEmployerJobListings,
  demoEmployerMatches
} from './demoData';

const DemoContext = createContext(null);

export const DEMO_ROLES = {
  CANDIDATE: 'candidate',
  EMPLOYER: 'employer'
};

export const useDemoContext = () => {
  const context = useContext(DemoContext);
  if (!context) {
    throw new Error('useDemoContext must be used within a DemoProvider');
  }
  return context;
};

export const DemoProvider = ({ children }) => {
  // Check environment variable for demo mode
  const isEnvDemoMode = isDemoModeEnabled();

  const [isDemoMode, setIsDemoMode] = useState(isEnvDemoMode);
  const [demoRole, setDemoRole] = useState(null); // null until role is selected
  const [currentJobIndex, setCurrentJobIndex] = useState(0);
  const [likedJobs, setLikedJobs] = useState(demoLikedJobs);
  const [currentMain, setCurrentMain] = useState(null);
  const [swipeAnimation, setSwipeAnimation] = useState('');

  // Get user based on selected role
  const user = demoRole === DEMO_ROLES.EMPLOYER ? demoEmployerUser : demoCandidateUser;

  // Candidate data
  const resume = demoResume;
  const jobListings = demoJobListings;
  const matches = demoMatches;
  const applications = demoApplications;

  // Employer data
  const candidates = demoCandidates;
  const receivedApplications = demoReceivedApplications;
  const employerJobListings = demoEmployerJobListings;
  const employerMatches = demoEmployerMatches;

  const getCurrentJob = useCallback(() => {
    if (currentJobIndex < jobListings.length) {
      return jobListings[currentJobIndex];
    }
    return null;
  }, [currentJobIndex, jobListings]);

  const handleNext = useCallback(() => {
    setSwipeAnimation('swipe-left');
    setTimeout(() => {
      setCurrentJobIndex(prev => prev + 1);
      setSwipeAnimation('');
    }, 300);
  }, []);

  const handleLike = useCallback(() => {
    const currentJob = getCurrentJob();
    if (currentJob && !likedJobs.find(job => job._id === currentJob._id)) {
      setLikedJobs(prev => [...prev, currentJob]);
    }
    setSwipeAnimation('swipe-right');
    setTimeout(() => {
      setCurrentJobIndex(prev => prev + 1);
      setSwipeAnimation('');
    }, 300);
  }, [getCurrentJob, likedJobs]);

  const handleReset = useCallback(() => {
    setCurrentJobIndex(0);
    setCurrentMain(null);
    setSwipeAnimation('');
  }, []);

  const receiveNewMain = useCallback((job) => {
    setCurrentMain(job);
  }, []);

  const clearMain = useCallback(() => {
    setCurrentMain(null);
  }, []);

  // Role selection handlers
  const selectRole = useCallback((role) => {
    if (Object.values(DEMO_ROLES).includes(role)) {
      setDemoRole(role);
      setIsDemoMode(true);
    }
  }, []);

  const exitDemo = useCallback(() => {
    setDemoRole(null);
    setIsDemoMode(isEnvDemoMode);
    setCurrentJobIndex(0);
    setCurrentMain(null);
    setSwipeAnimation('');
  }, [isEnvDemoMode]);

  const value = {
    // Demo mode state
    isDemoMode,
    setIsDemoMode,
    isEnvDemoMode,
    demoRole,
    selectRole,
    exitDemo,

    // User data
    user,

    // Candidate data
    resume,
    jobListings,
    likedJobs,
    matches,
    applications,

    // Employer data
    candidates,
    receivedApplications,
    employerJobListings,
    employerMatches,

    // Browse state
    currentJobIndex,
    currentMain,
    swipeAnimation,

    // Actions
    getCurrentJob,
    handleNext,
    handleLike,
    handleReset,
    receiveNewMain,
    clearMain
  };

  return (
    <DemoContext.Provider value={value}>
      {children}
    </DemoContext.Provider>
  );
};

export default DemoContext;
