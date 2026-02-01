import React from 'react';
import { useDemoContext } from '../DemoContext';

const DemoMatchesPage = () => {
  const { matches } = useDemoContext();

  const getStatusBadge = (status) => {
    const statusMap = {
      mutual_interest: { label: 'Mutual Interest', class: 'badge-success' },
      employer_interested: { label: 'Employer Interested', class: 'badge-primary' },
      pending: { label: 'Pending', class: 'badge-secondary' }
    };
    const statusInfo = statusMap[status] || statusMap.pending;
    return <span className={statusInfo.class}>{statusInfo.label}</span>;
  };

  if (matches.length === 0) {
    return (
      <div className="matches-index-container">
        <h2>You do not have any matches yet.</h2>
        <h4>Connect with jobs you like and check back later.</h4>
      </div>
    );
  }

  return (
    <div className="matches-container p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Your Matches</h1>
        <p className="text-secondary-600">
          These employers have shown interest in your profile!
        </p>
      </div>

      <div className="grid gap-4">
        {matches.map((match) => (
          <div key={match._id} className="card p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-semibold">
                  {match.jobListing.jobTitle}
                </h2>
                <p className="text-secondary-600">
                  at {match.jobListing.companyName}
                </p>
              </div>
              <div className="text-right">
                {getStatusBadge(match.status)}
                <div className="mt-2 text-sm text-secondary-500">
                  {match.matchScore}% match
                </div>
              </div>
            </div>

            <div className="mb-4">
              <h4 className="text-sm font-medium text-secondary-700 mb-2">
                Matched Skills:
              </h4>
              <div className="flex flex-wrap gap-2">
                {match.matchedSkills.map((skill, i) => (
                  <span key={i} className="badge-secondary">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex gap-4 mt-4">
              <p className="text-sm text-secondary-600">
                <strong>Salary:</strong> ${parseInt(match.jobListing.startingPay).toLocaleString()}
              </p>
              <p className="text-sm text-secondary-600">
                <strong>Type:</strong> {match.jobListing.type}
              </p>
              <p className="text-sm text-secondary-600">
                <strong>Remote:</strong> {match.jobListing.remote ? 'Yes' : 'No'}
              </p>
            </div>

            <div className="mt-4 pt-4 border-t border-secondary-200">
              <button className="btn-primary mr-2">Send Message</button>
              <button className="btn-secondary">View Details</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DemoMatchesPage;
