import React from 'react';
import { useDemoContext } from '../DemoContext';

const DemoResumePage = () => {
  const { user, resume } = useDemoContext();

  return (
    <div className="resume-container p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">My Resume</h1>
        <p className="text-secondary-600">
          Your professional profile visible to employers
        </p>
      </div>

      <div className="card p-8">
        {/* Resume Header */}
        <div className="resume-header mb-8 pb-6 border-b">
          <h2 className="text-2xl font-bold mb-1">
            {user.fName} {user.lName}
          </h2>
          <p className="text-lg text-secondary-600 mb-2">{resume.jobField} Professional</p>
          <p className="text-secondary-500">{user.email}</p>
        </div>

        {/* Skills Section */}
        <div className="resume-section mb-8">
          <h3 className="text-lg font-semibold mb-4 text-primary-600">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {resume.jobSkills.split(', ').map((skill, i) => (
              <span key={i} className="skill-badge">{skill}</span>
            ))}
          </div>
        </div>

        {/* Experience Section */}
        <div className="resume-section mb-8">
          <h3 className="text-lg font-semibold mb-4 text-primary-600">Experience</h3>
          <div className="experience-list">
            {resume.jobHistory.split('\n').map((job, i) => {
              const [title, period] = job.includes('(')
                ? [job.split('(')[0].trim(), job.match(/\(([^)]+)\)/)?.[1]]
                : [job, ''];
              return (
                <div key={i} className="experience-item mb-4 pb-4 border-b border-secondary-100 last:border-0">
                  <h4 className="font-medium">{title}</h4>
                  {period && <p className="text-sm text-secondary-500">{period}</p>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Preferences Section */}
        <div className="resume-section">
          <h3 className="text-lg font-semibold mb-4 text-primary-600">Job Preferences</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="preference-item">
              <label className="text-sm text-secondary-500">Desired Field</label>
              <p className="font-medium">{user.preference?.jobField || 'Open'}</p>
            </div>
            <div className="preference-item">
              <label className="text-sm text-secondary-500">Location Preference</label>
              <p className="font-medium">{user.preference?.location || 'Flexible'}</p>
            </div>
            <div className="preference-item">
              <label className="text-sm text-secondary-500">Expected Salary</label>
              <p className="font-medium">
                {user.preference?.salary
                  ? `$${parseInt(user.preference.salary).toLocaleString()}`
                  : 'Negotiable'}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 pt-6 border-t flex gap-4">
          <button className="btn-primary">Edit Resume</button>
          <button className="btn-secondary">Download PDF</button>
          <button className="btn-secondary">Preview</button>
        </div>
      </div>

      <style>{`
        .resume-container {
          min-height: calc(100vh - 80px);
        }

        .card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .skill-badge {
          display: inline-block;
          background: linear-gradient(135deg, #667eea15 0%, #764ba215 100%);
          color: #667eea;
          padding: 0.375rem 0.875rem;
          border-radius: 9999px;
          font-size: 0.875rem;
          font-weight: 500;
          border: 1px solid #667eea30;
        }

        .btn-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 0.625rem 1.25rem;
          border-radius: 6px;
          font-weight: 500;
          cursor: pointer;
          border: none;
        }

        .btn-secondary {
          background: #f3f4f6;
          color: #374151;
          padding: 0.625rem 1.25rem;
          border-radius: 6px;
          font-weight: 500;
          cursor: pointer;
          border: 1px solid #e5e7eb;
        }

        .btn-secondary:hover {
          background: #e5e7eb;
        }
      `}</style>
    </div>
  );
};

export default DemoResumePage;
