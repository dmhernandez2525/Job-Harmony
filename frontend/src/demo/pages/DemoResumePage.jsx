import React from 'react';
import { useDemoContext } from '../DemoContext';

const DemoResumePage = () => {
  const { user, resume } = useDemoContext();

  return (
    <div className="resume-container p-4 md:p-6 max-w-4xl mx-auto">
      <div className="mb-4 md:mb-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-1 md:mb-2">My Resume</h1>
        <p className="text-secondary-600 text-sm md:text-base">
          Your professional profile visible to employers
        </p>
      </div>

      <div className="card p-4 md:p-8">
        {/* Resume Header */}
        <div className="resume-header mb-5 md:mb-8 pb-4 md:pb-6 border-b">
          <h2 className="text-xl md:text-2xl font-bold mb-1">
            {user.fName} {user.lName}
          </h2>
          <p className="text-sm md:text-lg text-secondary-600 mb-1 md:mb-2">{resume.jobField} Professional</p>
          <p className="text-secondary-500 text-sm">{user.email}</p>
        </div>

        {/* Skills Section */}
        <div className="resume-section mb-5 md:mb-8">
          <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4 text-primary-600">Skills</h3>
          <div className="flex flex-wrap gap-1.5 md:gap-2">
            {resume.jobSkills.split(', ').map((skill, i) => (
              <span key={i} className="skill-badge">{skill}</span>
            ))}
          </div>
        </div>

        {/* Experience Section */}
        <div className="resume-section mb-5 md:mb-8">
          <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4 text-primary-600">Experience</h3>
          <div className="experience-list">
            {resume.jobHistory.split('\n').map((job, i) => {
              const [title, period] = job.includes('(')
                ? [job.split('(')[0].trim(), job.match(/\(([^)]+)\)/)?.[1]]
                : [job, ''];
              return (
                <div key={i} className="experience-item mb-3 md:mb-4 pb-3 md:pb-4 border-b border-secondary-100 last:border-0">
                  <h4 className="font-medium text-sm md:text-base">{title}</h4>
                  {period && <p className="text-xs md:text-sm text-secondary-500">{period}</p>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Preferences Section */}
        <div className="resume-section">
          <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4 text-primary-600">Job Preferences</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
            <div className="preference-item">
              <label className="text-xs md:text-sm text-secondary-500">Desired Field</label>
              <p className="font-medium text-sm md:text-base">{user.preference?.jobField || 'Open'}</p>
            </div>
            <div className="preference-item">
              <label className="text-xs md:text-sm text-secondary-500">Location</label>
              <p className="font-medium text-sm md:text-base">{user.preference?.location || 'Flexible'}</p>
            </div>
            <div className="preference-item">
              <label className="text-xs md:text-sm text-secondary-500">Salary</label>
              <p className="font-medium text-sm md:text-base">
                {user.preference?.salary
                  ? `$${parseInt(user.preference.salary).toLocaleString()}`
                  : 'Negotiable'}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-5 md:mt-8 pt-4 md:pt-6 border-t flex gap-2 md:gap-4">
          <button className="btn-primary text-xs md:text-sm flex-1 md:flex-none">Edit Resume</button>
          <button className="btn-secondary text-xs md:text-sm flex-1 md:flex-none">Download PDF</button>
          <button className="btn-secondary text-xs md:text-sm flex-1 md:flex-none">Preview</button>
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
