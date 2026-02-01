import React from 'react';

const DemoPendingItem = ({ job, receiveNewMain }) => {
  const randomNum = (job.jobTitle.length % 3) + 1;
  const iconClassName = `${job.jobField}-${randomNum}`;

  const handleClick = () => {
    receiveNewMain(job);
  };

  return (
    <div className="pending-index-item" onClick={handleClick}>
      <div className={`icon ${iconClassName}`}></div>
      <div className="like-info">
        <h3 className="pending-job-title">{job.jobTitle}</h3>
        <h5 className="pending-company-name">{job.companyName}</h5>
      </div>
    </div>
  );
};

export default DemoPendingItem;
