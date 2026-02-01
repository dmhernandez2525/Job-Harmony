import React from 'react';
import { useDemoContext } from '../DemoContext';
import DemoPendingItem from './DemoPendingItem';

const DemoPendingIndex = () => {
  const { likedJobs, receiveNewMain } = useDemoContext();

  const allLikes = likedJobs.map((job, i) => (
    <DemoPendingItem
      key={i}
      job={job}
      receiveNewMain={receiveNewMain}
    />
  ));

  return (
    <div className="pending-index-container">
      <div className="pending-header-text">
        <h3>Your Pending Matches</h3>
      </div>
      <div className="pending-index-rows">
        {likedJobs.length > 0 ? (
          allLikes
        ) : (
          <p className="text-secondary-500 p-4 text-sm">
            Jobs you like will appear here
          </p>
        )}
      </div>
    </div>
  );
};

export default DemoPendingIndex;
