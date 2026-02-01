import React from 'react';
import { useDemoContext } from '../DemoContext';
import DemoJobDetail from './DemoJobDetail';
import DemoEndOfResults from './DemoEndOfResults';

const DemoBrowseWindow = () => {
  const {
    getCurrentJob,
    currentMain,
    swipeAnimation,
    handleNext,
    handleLike,
    clearMain,
    jobListings,
    currentJobIndex
  } = useDemoContext();

  const currentJob = getCurrentJob();
  const isEndOfResults = currentJobIndex >= jobListings.length;

  // If viewing a specific job from pending
  if (currentMain) {
    return (
      <div className="browse-window-container">
        <div className="browse-header-text">
          <h3>{currentMain.jobTitle}</h3>
        </div>
        <div className="browse-window">
          <DemoJobDetail job={currentMain} />
        </div>
        <div className="buttons-container">
          <div className="button-3">
            <button onClick={clearMain}>Go Back</button>
          </div>
        </div>
      </div>
    );
  }

  // End of results
  if (isEndOfResults) {
    return (
      <div className="browse-window-container">
        <div className="browse-header-text">
          <h3>Recommended For You</h3>
        </div>
        <div className="browse-window">
          <DemoEndOfResults />
        </div>
        <div className="buttons-container"></div>
      </div>
    );
  }

  // Normal browsing
  return (
    <div className="browse-window-container">
      <div className="browse-header-text">
        <h3>Recommended For You</h3>
      </div>
      <div className="browse-window">
        <div className={`onepage-detail-container ${swipeAnimation}`}>
          <DemoJobDetail job={currentJob} />
        </div>
      </div>
      <div className="buttons-container">
        <div className="button-1">
          <button onClick={handleNext}>Not Interested</button>
        </div>
        <div className="button-2">
          <button onClick={handleLike}>Interested</button>
        </div>
      </div>
    </div>
  );
};

export default DemoBrowseWindow;
