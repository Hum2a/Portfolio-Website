import React from 'react';
import { analytics } from '../utils/analytics';

const DownloadButton = ({ fileUrl, fileName, fileType }) => {
  const handleDownload = () => {
    analytics.trackDownload(fileName, fileType);
  };
  
  return (
    <a 
      href={fileUrl} 
      download={fileName}
      onClick={handleDownload}
      className="download-button"
    >
      Download {fileName}
    </a>
  );
};

export default DownloadButton; 