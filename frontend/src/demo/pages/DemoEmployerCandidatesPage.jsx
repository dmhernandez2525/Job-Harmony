import React from 'react';
import { useDemoContext } from '../DemoContext';

const DemoEmployerCandidatesPage = () => {
  const { candidates, employerMatches } = useDemoContext();

  // Merge candidate data with match scores
  const candidatesWithScores = candidates.map(candidate => {
    const match = employerMatches.find(m => m.candidate._id === candidate._id);
    return {
      ...candidate,
      matchScore: match?.matchScore || candidate.matchScore,
      matchedSkills: match?.matchedSkills || [],
      matchStatus: match?.status || 'discovered'
    };
  });

  const getStatusBadge = (status) => {
    const statusMap = {
      mutual_interest: { label: 'Mutual Interest', class: 'status-mutual' },
      employer_interested: { label: 'You Liked', class: 'status-liked' },
      discovered: { label: 'New', class: 'status-new' }
    };
    const statusInfo = statusMap[status] || statusMap.discovered;
    return <span className={`status-badge ${statusInfo.class}`}>{statusInfo.label}</span>;
  };

  return (
    <div className="candidates-container p-4 md:p-6 max-w-6xl mx-auto">
      <div className="mb-4 md:mb-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-1 md:mb-2">Candidate Pool</h1>
        <p className="text-secondary-600 text-sm md:text-base">
          Browse and connect with potential candidates
        </p>
      </div>

      {/* Candidates Grid */}
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
        {candidatesWithScores.map((candidate) => (
          <div key={candidate._id} className="card candidate-card">
            <div className="card-header">
              <div className="avatar-lg">
                {candidate.fName[0]}{candidate.lName[0]}
              </div>
              <div className="match-score">
                <div className="score-value">{candidate.matchScore}%</div>
                <div className="score-label">Match</div>
              </div>
            </div>

            <div className="card-body">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-lg">
                    {candidate.fName} {candidate.lName}
                  </h3>
                  <p className="text-sm text-secondary-600">{candidate.resume.jobField}</p>
                </div>
                {getStatusBadge(candidate.matchStatus)}
              </div>

              <div className="mb-4">
                <p className="text-sm text-secondary-500 mb-2">Experience:</p>
                <p className="text-sm text-secondary-700 line-clamp-2">
                  {candidate.resume.jobHistory.split('\n')[0]}
                </p>
              </div>

              <div className="mb-4">
                <p className="text-sm text-secondary-500 mb-2">Skills:</p>
                <div className="flex flex-wrap gap-1">
                  {candidate.resume.jobSkills.split(', ').slice(0, 4).map((skill, i) => (
                    <span
                      key={i}
                      className={`skill-badge ${candidate.matchedSkills?.includes(skill) ? 'matched' : ''}`}
                    >
                      {skill}
                    </span>
                  ))}
                  {candidate.resume.jobSkills.split(', ').length > 4 && (
                    <span className="skill-badge">
                      +{candidate.resume.jobSkills.split(', ').length - 4}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="card-footer">
              <button className="btn-primary flex-1">View Profile</button>
              <button className="btn-secondary">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </button>
              <button className="btn-secondary btn-like">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .candidates-container {
          min-height: calc(100vh - 80px);
        }

        .card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }

        .candidate-card {
          display: flex;
          flex-direction: column;
        }

        .card-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .avatar-lg {
          width: 4rem;
          height: 4rem;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.2);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 1.25rem;
        }

        .match-score {
          text-align: right;
          color: white;
        }

        .score-value {
          font-size: 1.5rem;
          font-weight: 700;
        }

        .score-label {
          font-size: 0.75rem;
          opacity: 0.8;
        }

        .card-body {
          padding: 1.5rem;
          flex: 1;
        }

        .card-footer {
          padding: 1rem 1.5rem;
          border-top: 1px solid #e5e7eb;
          display: flex;
          gap: 0.5rem;
        }

        .status-badge {
          display: inline-block;
          padding: 0.25rem 0.625rem;
          border-radius: 9999px;
          font-size: 0.7rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.025em;
        }

        .status-mutual {
          background: #d1fae5;
          color: #065f46;
        }

        .status-liked {
          background: #ede9fe;
          color: #5b21b6;
        }

        .status-new {
          background: #dbeafe;
          color: #1e40af;
        }

        .skill-badge {
          display: inline-block;
          background: #f3f4f6;
          color: #374151;
          padding: 0.25rem 0.5rem;
          border-radius: 9999px;
          font-size: 0.7rem;
          font-weight: 500;
        }

        .skill-badge.matched {
          background: #d1fae5;
          color: #065f46;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .btn-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 0.625rem 1rem;
          border-radius: 6px;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          border: none;
        }

        .btn-secondary {
          background: #f3f4f6;
          color: #374151;
          padding: 0.625rem;
          border-radius: 6px;
          cursor: pointer;
          border: 1px solid #e5e7eb;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .btn-secondary:hover {
          background: #e5e7eb;
        }

        .btn-like:hover {
          background: #fce7f3;
          border-color: #f9a8d4;
          color: #be185d;
        }

        .btn-like:hover svg {
          fill: #be185d;
        }
      `}</style>
    </div>
  );
};

export default DemoEmployerCandidatesPage;
