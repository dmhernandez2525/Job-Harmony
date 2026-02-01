import React from 'react';

const DemoJobDetail = ({ job }) => {
  if (!job) {
    return <div className="onepage-detail-container">Loading...</div>;
  }

  const jobSkills = job.jobSkills.split(',');
  const skillsList = jobSkills.map((skill, i) => (
    <li key={i}>{skill.trim()}</li>
  ));

  const randomNum = (job.jobTitle.length % 3) + 1;
  const remoteValue = job.remote ? 'Yes' : 'No';

  return (
    <div className="onepage-detail-container">
      <div className="op-detail-header">
        <div className={`banner ${job.jobField}-${randomNum}`}></div>
        <div className="op-header-text">
          <h1>{job.jobTitle}</h1>
          <h2>at&nbsp;{job.companyName}</h2>
          <h4>Field:&nbsp;{job.jobField}</h4>
        </div>
      </div>
      <div className="op-detail-bottom-box">
        <div className="op-detail-left">
          <div className="salary-div">
            <h3>Starting Salary:</h3>
            <h3>${parseInt(job.startingPay).toLocaleString()}</h3>
          </div>
          <div className="job-descrip-div">
            <h3>Job Description:</h3>
            <p>{job.description}</p>
          </div>
          <div className="skills-req-div">
            <h3>Skills Required</h3>
            <ul>{skillsList}</ul>
          </div>
        </div>
        <div className="op-detail-right">
          <div className="position-div">
            <h3>Position is:</h3>
            <h3>{job.type}</h3>
          </div>
          <div className="remote-div">
            <h3>Remote?:</h3>
            <h3>{remoteValue}</h3>
          </div>
          <div className="benefits-div">
            <h3>Benefits</h3>
            <p>{job.benefits}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoJobDetail;
