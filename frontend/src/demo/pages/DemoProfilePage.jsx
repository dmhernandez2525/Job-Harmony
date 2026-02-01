import React from 'react';
import { useDemoContext } from '../DemoContext';

const DemoProfilePage = () => {
  const { user, resume } = useDemoContext();

  return (
    <div className="profile-container p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">My Profile</h1>
        <p className="text-secondary-600">
          Manage your profile and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="card p-6 md:col-span-1">
          <div className="text-center mb-4">
            <div className="w-24 h-24 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl font-bold text-primary-600">
                {user.fName[0]}{user.lName[0]}
              </span>
            </div>
            <h2 className="text-xl font-semibold">{user.fName} {user.lName}</h2>
            <p className="text-secondary-600">{user.role}</p>
          </div>

          <div className="border-t pt-4">
            <div className="mb-3">
              <label className="text-sm text-secondary-500">Email</label>
              <p className="font-medium">{user.email}</p>
            </div>
            <div className="mb-3">
              <label className="text-sm text-secondary-500">Location</label>
              <p className="font-medium">{user.zipCode}</p>
            </div>
            <div>
              <label className="text-sm text-secondary-500">Member Since</label>
              <p className="font-medium">
                {new Date(user.date).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Preferences Card */}
        <div className="card p-6 md:col-span-2">
          <h3 className="text-xl font-semibold mb-4">Job Preferences</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-secondary-50 rounded-lg">
              <label className="text-sm text-secondary-500">Job Field</label>
              <p className="font-medium text-lg">{user.preference?.jobField || 'Not set'}</p>
            </div>
            <div className="p-4 bg-secondary-50 rounded-lg">
              <label className="text-sm text-secondary-500">Preferred Location</label>
              <p className="font-medium text-lg">{user.preference?.location || 'Not set'}</p>
            </div>
            <div className="p-4 bg-secondary-50 rounded-lg">
              <label className="text-sm text-secondary-500">Expected Salary</label>
              <p className="font-medium text-lg">
                {user.preference?.salary
                  ? `$${parseInt(user.preference.salary).toLocaleString()}`
                  : 'Not set'}
              </p>
            </div>
            <div className="p-4 bg-secondary-50 rounded-lg">
              <label className="text-sm text-secondary-500">Profile Status</label>
              <p className="font-medium text-lg text-green-600">Active</p>
            </div>
          </div>

          <div className="mt-6">
            <button className="btn-primary mr-2">Edit Preferences</button>
            <button className="btn-secondary">Update Profile</button>
          </div>
        </div>

        {/* Resume Summary */}
        {resume && (
          <div className="card p-6 md:col-span-3">
            <h3 className="text-xl font-semibold mb-4">Resume Summary</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-secondary-700 mb-2">Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {resume.jobSkills.split(', ').map((skill, i) => (
                    <span key={i} className="badge-secondary">{skill}</span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-secondary-700 mb-2">Experience</h4>
                <div className="text-sm text-secondary-600 whitespace-pre-line">
                  {resume.jobHistory}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .profile-container {
          min-height: calc(100vh - 80px);
        }

        .card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .badge-secondary {
          display: inline-block;
          background: #e5e7eb;
          color: #374151;
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 500;
        }

        .btn-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          font-weight: 500;
          cursor: pointer;
          border: none;
        }

        .btn-secondary {
          background: #e5e7eb;
          color: #374151;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          font-weight: 500;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  );
};

export default DemoProfilePage;
