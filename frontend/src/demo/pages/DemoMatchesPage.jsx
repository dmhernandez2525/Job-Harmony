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
    <div className="matches-container p-4 md:p-6 max-w-4xl mx-auto">
      <div className="mb-4 md:mb-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-1 md:mb-2">Your Matches</h1>
        <p className="text-secondary-600 text-sm md:text-base">
          These employers have shown interest in your profile!
        </p>
      </div>

      <div className="grid gap-3 md:gap-4">
        {matches.map((match) => (
          <div key={match._id} className="card p-4 md:p-6">
            <div className="flex justify-between items-start mb-3 md:mb-4">
              <div className="flex-1 min-w-0 mr-3">
                <h2 className="text-base md:text-xl font-semibold truncate">
                  {match.jobListing.jobTitle}
                </h2>
                <p className="text-secondary-600 text-sm">
                  at {match.jobListing.companyName}
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                {getStatusBadge(match.status)}
                <div className="mt-1 md:mt-2 text-xs md:text-sm text-secondary-500">
                  {match.matchScore}% match
                </div>
              </div>
            </div>

            <div className="mb-3 md:mb-4">
              <h4 className="text-xs md:text-sm font-medium text-secondary-700 mb-1 md:mb-2">
                Matched Skills:
              </h4>
              <div className="flex flex-wrap gap-1.5 md:gap-2">
                {match.matchedSkills.map((skill, i) => (
                  <span key={i} className="badge-secondary text-xs">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-2 md:gap-4 mt-3 md:mt-4 text-xs md:text-sm text-secondary-600">
              <p>
                <strong>Salary:</strong> ${parseInt(match.jobListing.startingPay).toLocaleString()}
              </p>
              <p>
                <strong>Type:</strong> {match.jobListing.type}
              </p>
              <p>
                <strong>Remote:</strong> {match.jobListing.remote ? 'Yes' : 'No'}
              </p>
            </div>

            <div className="mt-3 md:mt-4 pt-3 md:pt-4 border-t border-secondary-200 flex gap-2">
              <button className="btn-primary text-xs md:text-sm flex-1 md:flex-none">Send Message</button>
              <button className="btn-secondary text-xs md:text-sm flex-1 md:flex-none">View Details</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DemoMatchesPage;
