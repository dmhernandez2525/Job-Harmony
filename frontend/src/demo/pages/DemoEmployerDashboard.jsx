import React from 'react';
import { Link } from 'react-router-dom';
import { useDemoContext } from '../DemoContext';

const DemoEmployerDashboard = () => {
  const {
    user,
    employerJobListings,
    receivedApplications,
    employerMatches
  } = useDemoContext();

  const pendingCount = receivedApplications.filter(a => a.status === 'pending').length;
  const interviewCount = receivedApplications.filter(a => a.status === 'interview_scheduled').length;

  return (
    <div className="dashboard-container p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Employer Dashboard</h1>
        <p className="text-secondary-600">
          Welcome back, {user.fName}! Manage your job listings and candidates.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="stat-card">
          <div className="stat-value text-blue-600">{employerJobListings.length}</div>
          <div className="stat-label">Active Listings</div>
        </div>
        <div className="stat-card">
          <div className="stat-value text-green-600">{receivedApplications.length}</div>
          <div className="stat-label">Total Applications</div>
        </div>
        <div className="stat-card">
          <div className="stat-value text-yellow-600">{pendingCount}</div>
          <div className="stat-label">Pending Review</div>
        </div>
        <div className="stat-card">
          <div className="stat-value text-purple-600">{interviewCount}</div>
          <div className="stat-label">Interviews Scheduled</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Applications */}
        <div className="card p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Recent Applications</h2>
            <Link to="/demo/employer/applications" className="text-primary-600 text-sm">
              View All
            </Link>
          </div>
          <div className="space-y-4">
            {receivedApplications.slice(0, 3).map((app) => (
              <div key={app._id} className="app-item p-4 bg-secondary-50 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">
                      {app.candidate.fName} {app.candidate.lName}
                    </h4>
                    <p className="text-sm text-secondary-600">
                      Applied for: {app.jobListing.jobTitle}
                    </p>
                    <p className="text-xs text-secondary-500 mt-1">
                      {new Date(app.appliedDate).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`status-badge status-${app.status}`}>
                    {app.status.replace(/_/g, ' ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Matches */}
        <div className="card p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Top Candidate Matches</h2>
            <Link to="/demo/employer/candidates" className="text-primary-600 text-sm">
              View All
            </Link>
          </div>
          <div className="space-y-4">
            {employerMatches.map((match) => (
              <div key={match._id} className="match-item p-4 bg-secondary-50 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">
                      {match.candidate.fName} {match.candidate.lName}
                    </h4>
                    <p className="text-sm text-secondary-600">
                      For: {match.jobListing.jobTitle}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {match.matchedSkills.slice(0, 3).map((skill, i) => (
                        <span key={i} className="text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-600">
                      {match.matchScore}%
                    </div>
                    <div className="text-xs text-secondary-500">Match</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Job Listings */}
        <div className="card p-6 lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Active Job Listings</h2>
            <button className="btn-primary-sm">Post New Job</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-secondary-600 text-sm">
                  <th className="pb-3">Position</th>
                  <th className="pb-3">Type</th>
                  <th className="pb-3">Salary</th>
                  <th className="pb-3">Applications</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {employerJobListings.map((job) => {
                  const jobApps = receivedApplications.filter(
                    a => a.jobListing._id === job._id
                  ).length;
                  return (
                    <tr key={job._id} className="border-t">
                      <td className="py-3">
                        <div className="font-medium">{job.jobTitle}</div>
                        <div className="text-sm text-secondary-500">{job.companyName}</div>
                      </td>
                      <td className="py-3">{job.type}</td>
                      <td className="py-3">${parseInt(job.startingPay).toLocaleString()}</td>
                      <td className="py-3">{jobApps}</td>
                      <td className="py-3">
                        <span className="status-badge status-active">Active</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <style>{`
        .dashboard-container {
          min-height: calc(100vh - 80px);
        }

        .card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .stat-card {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          text-align: center;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .stat-value {
          font-size: 2rem;
          font-weight: 700;
        }

        .stat-label {
          font-size: 0.875rem;
          color: #666;
          margin-top: 0.25rem;
        }

        .status-badge {
          display: inline-block;
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 500;
          text-transform: capitalize;
        }

        .status-pending {
          background: #fef3c7;
          color: #92400e;
        }

        .status-application_reviewed {
          background: #dbeafe;
          color: #1e40af;
        }

        .status-interview_scheduled {
          background: #d1fae5;
          color: #065f46;
        }

        .status-active {
          background: #d1fae5;
          color: #065f46;
        }

        .btn-primary-sm {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  );
};

export default DemoEmployerDashboard;
