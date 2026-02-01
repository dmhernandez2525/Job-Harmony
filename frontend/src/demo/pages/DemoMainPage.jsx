import React from 'react';
import DemoBrowseWindow from '../components/DemoBrowseWindow';
import DemoPendingIndex from '../components/DemoPendingIndex';

const DemoMainPage = () => {
  return (
    <div className="home-page-container">
      <DemoPendingIndex />
      <div className="browse-buttons-container">
        <DemoBrowseWindow />
      </div>
    </div>
  );
};

export default DemoMainPage;
