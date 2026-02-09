import React, { useState } from 'react';
import { useDemoContext } from '../DemoContext';

const DemoEmployerApplicationsPage = () => {
  const { receivedApplications } = useDemoContext();
  const [filter, setFilter] = useState('all');

  const filteredApplications = filter === 'all'
    ? receivedApplications
    : receivedApplications.filter(app => app.status === filter);

  const getStatusBadge = (status) => {
    const statusMap = {
      pending: { label: 'New', class: 'status-pending' },
      application_reviewed: { label: 'Under Review', class: 'status-reviewed' },
      interview_scheduled: { label: 'Interview', class: 'status-interview' },
      rejected: { label: 'Declined', class: 'status-rejected' },
      offer_sent: { label: 'Offer Sent', class: 'status-offer' }
    };
    const statusInfo = statusMap[status] || statusMap.pending;
    return <span className={`status-badge ${statusInfo.class}`}>{statusInfo.label}</span>;
  };

  return (
    <div className="applications-container p-4 md:p-6 max-w-6xl mx-auto">
      <div className="mb-4 md:mb-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-1 md:mb-2">Received Applications</h1>
        <p className="text-secondary-600 text-sm md:text-base">
          Review and manage applications from candidates
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="filter-tabs mb-6">
        <button
          className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All ({receivedApplications.length})
        </button>
        <button
          className={`filter-tab ${filter === 'pending' ? 'active' : ''}`}
          onClick={() => setFilter('pending')}
        >
          New ({receivedApplications.filter(a => a.status === 'pending').length})
        </button>
        <button
          className={`filter-tab ${filter === 'application_reviewed' ? 'active' : ''}`}
          onClick={() => setFilter('application_reviewed')}
        >
          Under Review ({receivedApplications.filter(a => a.status === 'application_reviewed').length})
        </button>
        <button
          className={`filter-tab ${filter === 'interview_scheduled' ? 'active' : ''}`}
          onClick={() => setFilter('interview_scheduled')}
        >
          Interview ({receivedApplications.filter(a => a.status === 'interview_scheduled').length})
        </button>
      </div>

      {/* Applications List */}
      <div className="space-y-3 md:space-y-4">
        {filteredApplications.map((app) => (
          <div key={app._id} className="card p-4 md:p-6">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-3 md:gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 md:gap-3 mb-2">
                  <div className="avatar flex-shrink-0">
                    {app.candidate.fName[0]}{app.candidate.lName[0]}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-semibold text-sm md:text-lg truncate">
                        {app.candidate.fName} {app.candidate.lName}
                      </h3>
                      <span className="md:hidden flex-shrink-0">{getStatusBadge(app.status)}</span>
                    </div>
                    <p className="text-secondary-600 text-xs md:text-base truncate">{app.candidate.email}</p>
                  </div>
                </div>

                <div className="mt-3">
                  <p className="text-xs md:text-sm text-secondary-500 mb-0.5 md:mb-1">Applied for:</p>
                  <p className="font-medium text-sm md:text-base">{app.jobListing.jobTitle}</p>
                </div>

                <div className="mt-3">
                  <p className="text-xs md:text-sm text-secondary-500 mb-1 md:mb-2">Skills:</p>
                  <div className="flex flex-wrap gap-1.5 md:gap-2">
                    {app.candidate.resume.jobSkills.split(', ').slice(0, 4).map((skill, i) => (
                      <span key={i} className="skill-badge">{skill}</span>
                    ))}
                    {app.candidate.resume.jobSkills.split(', ').length > 4 && (
                      <span className="skill-badge">
                        +{app.candidate.resume.jobSkills.split(', ').length - 4} more
                      </span>
                    )}
                  </div>
                </div>

                {app.notes && (
                  <div className="mt-3 p-2 md:p-3 bg-secondary-50 rounded-lg">
                    <p className="text-xs md:text-sm text-secondary-600 line-clamp-2">{app.notes}</p>
                  </div>
                )}
              </div>

              <div className="flex flex-row md:flex-col items-center md:items-end gap-2 md:gap-3 mt-1 md:mt-0">
                <span className="hidden md:inline-block">{getStatusBadge(app.status)}</span>
                <div className="text-xs md:text-sm text-secondary-500">
                  Applied: {new Date(app.appliedDate).toLocaleDateString()}
                </div>
                {app.interviewDate && (
                  <div className="text-xs md:text-sm text-green-600 font-medium">
                    Interview: {new Date(app.interviewDate).toLocaleDateString()}
                  </div>
                )}
                <div className="flex gap-2 ml-auto md:ml-0 md:mt-2">
                  <button className="btn-primary-sm">View Resume</button>
                  <button className="btn-secondary-sm">Message</button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {filteredApplications.length === 0 && (
          <div className="card p-8 text-center">
            <p className="text-secondary-600">No applications match the selected filter.</p>
          </div>
        )}
      </div>

      <style>{`
        .applications-container {
          min-height: calc(100vh - 80px);
        }

        .card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .filter-tabs {
          display: flex;
          gap: 0.5rem;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
          -ms-overflow-style: none;
          padding-bottom: 0.25rem;
        }

        .filter-tabs::-webkit-scrollbar {
          display: none;
        }

        .filter-tab {
          padding: 0.5rem 0.75rem;
          border-radius: 9999px;
          background: #f3f4f6;
          color: #666;
          font-size: 0.75rem;
          font-weight: 500;
          cursor: pointer;
          border: none;
          transition: all 0.2s;
          white-space: nowrap;
          flex-shrink: 0;
        }

        @media (min-width: 768px) {
          .filter-tabs {
            flex-wrap: wrap;
            overflow-x: visible;
          }

          .filter-tab {
            padding: 0.5rem 1rem;
            font-size: 0.875rem;
          }
        }

        .filter-tab:hover {
          background: #e5e7eb;
        }

        .filter-tab.active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .avatar {
          width: 3rem;
          height: 3rem;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
        }

        .status-badge {
          display: inline-block;
          padding: 0.375rem 0.875rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.025em;
        }

        .status-pending {
          background: #fef3c7;
          color: #92400e;
        }

        .status-reviewed {
          background: #dbeafe;
          color: #1e40af;
        }

        .status-interview {
          background: #d1fae5;
          color: #065f46;
        }

        .status-rejected {
          background: #fee2e2;
          color: #991b1b;
        }

        .status-offer {
          background: #ede9fe;
          color: #5b21b6;
        }

        .skill-badge {
          display: inline-block;
          background: #f3f4f6;
          color: #374151;
          padding: 0.25rem 0.625rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 500;
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

        .btn-secondary-sm {
          background: #f3f4f6;
          color: #374151;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          border: 1px solid #e5e7eb;
        }

        .btn-secondary-sm:hover {
          background: #e5e7eb;
        }
      `}</style>
    </div>
  );
};

export default DemoEmployerApplicationsPage;
