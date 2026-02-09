import React from 'react';
import { useDemoContext } from '../DemoContext';

const DemoApplicationsPage = () => {
  const { applications } = useDemoContext();

  const getStatusBadge = (status) => {
    const statusMap = {
      pending: { label: 'Pending', class: 'badge-secondary' },
      application_reviewed: { label: 'Under Review', class: 'badge-primary' },
      interview_scheduled: { label: 'Interview Scheduled', class: 'badge-success' },
      rejected: { label: 'Not Selected', class: 'badge-danger' },
      offer_received: { label: 'Offer Received', class: 'badge-success' }
    };
    const statusInfo = statusMap[status] || statusMap.pending;
    return <span className={statusInfo.class}>{statusInfo.label}</span>;
  };

  return (
    <div className="applications-container p-4 md:p-6 max-w-4xl mx-auto">
      <div className="mb-4 md:mb-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Your Applications</h1>
        <p className="text-secondary-600 text-sm md:text-base">
          Track the status of your job applications
        </p>
      </div>

      {/* Desktop table view */}
      <div className="card hidden md:block">
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Position</th>
                <th>Company</th>
                <th>Applied Date</th>
                <th>Status</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app._id}>
                  <td className="font-medium">{app.jobListing.jobTitle}</td>
                  <td>{app.jobListing.companyName}</td>
                  <td>{new Date(app.appliedDate).toLocaleDateString()}</td>
                  <td>{getStatusBadge(app.status)}</td>
                  <td className="text-sm text-secondary-600 max-w-xs truncate">
                    {app.notes}
                    {app.interviewDate && (
                      <div className="text-primary-600 mt-1">
                        Interview: {new Date(app.interviewDate).toLocaleDateString()}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile card view */}
      <div className="md:hidden space-y-3">
        {applications.map((app) => (
          <div key={app._id} className="card p-4">
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1 min-w-0 mr-2">
                <h3 className="font-semibold text-sm truncate">{app.jobListing.jobTitle}</h3>
                <p className="text-xs text-secondary-600">{app.jobListing.companyName}</p>
              </div>
              {getStatusBadge(app.status)}
            </div>
            <div className="flex items-center gap-3 text-xs text-secondary-500 mt-2">
              <span>Applied: {new Date(app.appliedDate).toLocaleDateString()}</span>
              {app.interviewDate && (
                <span className="text-primary-600 font-medium">
                  Interview: {new Date(app.interviewDate).toLocaleDateString()}
                </span>
              )}
            </div>
            {app.notes && (
              <p className="text-xs text-secondary-500 mt-2 line-clamp-2">{app.notes}</p>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 md:mt-8 grid grid-cols-3 gap-2 md:gap-4">
        <div className="card p-3 md:p-4 text-center">
          <div className="text-xl md:text-3xl font-bold text-primary-600">
            {applications.length}
          </div>
          <div className="text-secondary-600 text-xs md:text-base">Total</div>
        </div>
        <div className="card p-3 md:p-4 text-center">
          <div className="text-xl md:text-3xl font-bold text-green-600">
            {applications.filter(a => a.status === 'interview_scheduled').length}
          </div>
          <div className="text-secondary-600 text-xs md:text-base">Interviews</div>
        </div>
        <div className="card p-3 md:p-4 text-center">
          <div className="text-xl md:text-3xl font-bold text-yellow-600">
            {applications.filter(a => a.status === 'application_reviewed' || a.status === 'pending').length}
          </div>
          <div className="text-secondary-600 text-xs md:text-base">Under Review</div>
        </div>
      </div>
    </div>
  );
};

export default DemoApplicationsPage;
