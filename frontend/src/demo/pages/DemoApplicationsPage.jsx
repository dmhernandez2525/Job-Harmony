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
    <div className="applications-container p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Your Applications</h1>
        <p className="text-secondary-600">
          Track the status of your job applications
        </p>
      </div>

      <div className="card">
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

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card p-4 text-center">
          <div className="text-3xl font-bold text-primary-600">
            {applications.length}
          </div>
          <div className="text-secondary-600">Total Applications</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-3xl font-bold text-green-600">
            {applications.filter(a => a.status === 'interview_scheduled').length}
          </div>
          <div className="text-secondary-600">Interviews Scheduled</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-3xl font-bold text-yellow-600">
            {applications.filter(a => a.status === 'application_reviewed' || a.status === 'pending').length}
          </div>
          <div className="text-secondary-600">Under Review</div>
        </div>
      </div>
    </div>
  );
};

export default DemoApplicationsPage;
