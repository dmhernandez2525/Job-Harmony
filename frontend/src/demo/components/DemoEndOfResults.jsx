import React from 'react';
import { useDemoContext } from '../DemoContext';

const DemoEndOfResults = () => {
  const { handleReset, likedJobs } = useDemoContext();

  return (
    <div className="end-of-results-container p-8 text-center">
      <h2 className="text-2xl font-bold mb-4">You have seen all available jobs!</h2>
      <p className="text-secondary-600 mb-6">
        You have liked {likedJobs.length} job{likedJobs.length !== 1 ? 's' : ''}.
        Check your pending matches to see if any employers are interested!
      </p>
      <button
        onClick={handleReset}
        className="btn-primary"
      >
        Browse Again
      </button>
    </div>
  );
};

export default DemoEndOfResults;
