import React, { createContext, useContext, useState, useCallback } from 'react';
import {
  demoUser,
  demoResume,
  demoJobListings,
  demoLikedJobs,
  demoMatches,
  demoApplications
} from './demoData';

const DemoContext = createContext(null);

export const useDemoContext = () => {
  const context = useContext(DemoContext);
  if (!context) {
    throw new Error('useDemoContext must be used within a DemoProvider');
  }
  return context;
};

export const DemoProvider = ({ children }) => {
  const [isDemoMode, setIsDemoMode] = useState(true);
  const [currentJobIndex, setCurrentJobIndex] = useState(0);
  const [likedJobs, setLikedJobs] = useState(demoLikedJobs);
  const [currentMain, setCurrentMain] = useState(null);
  const [swipeAnimation, setSwipeAnimation] = useState('');

  const user = demoUser;
  const resume = demoResume;
  const jobListings = demoJobListings;
  const matches = demoMatches;
  const applications = demoApplications;

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

  const value = {
    isDemoMode,
    setIsDemoMode,
    user,
    resume,
    jobListings,
    likedJobs,
    matches,
    applications,
    currentJobIndex,
    currentMain,
    swipeAnimation,
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
