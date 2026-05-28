import React from 'react';

const formatValue = (value, { suffix = '' } = {}) => {
  if (value === null || value === undefined || value === '') return 'N/A';
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  return `${value}${suffix}`;
};

const DEVICE_INFO_SECTIONS = [
  {
    title: 'Browser',
    items: [
      { label: 'Browser', key: 'browser' },
      { label: 'Browser version', key: 'browserVersion' },
      { label: 'UA brands (Client Hints)', key: 'uaBrands' },
      { label: 'Full version list', key: 'uaFullVersionList', className: 'user-agent' },
      { label: 'User agent', key: 'userAgent', className: 'user-agent' },
    ],
  },
  {
    title: 'Operating system',
    items: [
      { label: 'OS', key: 'os' },
      { label: 'OS version', key: 'osVersion' },
      { label: 'UA platform', key: 'uaPlatform' },
      { label: 'Platform version', key: 'uaPlatformVersion' },
      { label: 'Architecture', key: 'uaArchitecture' },
      { label: 'Bitness', key: 'uaBitness' },
      { label: 'Device model', key: 'uaDeviceModel' },
      { label: 'Device type', key: 'deviceType' },
      { label: 'Platform', key: 'platform' },
      { label: 'Vendor', key: 'vendor' },
      { label: 'WOW64', key: 'uaWow64' },
    ],
  },
  {
    title: 'Display',
    items: [
      { label: 'Viewport', key: 'screenSize' },
      { label: 'Window (outer)', key: 'outerSize' },
      { label: 'Screen resolution', key: 'screenResolution' },
      { label: 'Available screen', key: 'screenAvailSize' },
      { label: 'Orientation', key: 'orientation' },
      { label: 'Color depth', key: 'colorDepth', suffix: ' bits' },
      { label: 'Pixel ratio', key: 'pixelRatio' },
    ],
  },
  {
    title: 'Hardware & input',
    items: [
      { label: 'CPU cores', key: 'hardwareConcurrency' },
      { label: 'Device memory (GB)', key: 'deviceMemory' },
      { label: 'Max touch points', key: 'maxTouchPoints' },
      { label: 'Touch capable', key: 'touchCapable' },
      { label: 'UA mobile flag', key: 'uaMobile' },
    ],
  },
  {
    title: 'Locale',
    items: [
      { label: 'Primary language', key: 'language' },
      { label: 'Languages', key: 'languages', className: 'user-agent' },
      { label: 'Timezone', key: 'timezone' },
      { label: 'UTC offset (min)', key: 'timezoneOffset' },
      { label: 'Character set', key: 'characterSet' },
    ],
  },
  {
    title: 'Network',
    items: [
      { label: 'Connection type', key: 'connectionType' },
      { label: 'Effective connection', key: 'effectiveConnectionType' },
      { label: 'Downlink (Mbps)', key: 'downlinkMbps' },
      { label: 'RTT (ms)', key: 'networkRtt' },
      { label: 'Data saver', key: 'saveData' },
    ],
  },
  {
    title: 'Preferences',
    items: [
      { label: 'Color scheme', key: 'prefersColorScheme' },
      { label: 'Reduced motion', key: 'prefersReducedMotion' },
      { label: 'PDF viewer', key: 'pdfViewerEnabled' },
    ],
  },
  {
    title: 'Privacy & signals',
    items: [
      { label: 'Cookies enabled', key: 'cookiesEnabled' },
      { label: 'Do Not Track', key: 'doNotTrack' },
      { label: 'Global Privacy Control', key: 'globalPrivacyControl' },
      { label: 'Automation (webdriver)', key: 'webdriver' },
      { label: 'Online', key: 'online' },
    ],
  },
];

export function DeviceInfoPanel({ deviceInfo }) {
  if (!deviceInfo) {
    return <p className="no-data">No device information available</p>;
  }

  return (
    <div className="info-grid">
      {DEVICE_INFO_SECTIONS.map((section) => (
        <div key={section.title} className="info-section">
          <h5>{section.title}</h5>
          {section.items.map((item) => (
            <div key={item.key} className="info-item">
              <span className="info-label">{item.label}:</span>
              <span className={`info-value ${item.className || ''}`}>
                {formatValue(deviceInfo[item.key], { suffix: item.suffix || '' })}
              </span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
