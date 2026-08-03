/**
 * Heuristic bot / VPN / hosting detection for portfolio analytics.
 * Not definitive — use as signals, not ground truth.
 */

const BOT_UA_PATTERNS = [
  /googlebot/i,
  /bingbot/i,
  /slurp/i,
  /duckduckbot/i,
  /baiduspider/i,
  /yandexbot/i,
  /facebookexternalhit/i,
  /twitterbot/i,
  /linkedinbot/i,
  /embedly/i,
  /quora link preview/i,
  /pinterestbot/i,
  /applebot/i,
  /semrushbot/i,
  /ahrefsbot/i,
  /mj12bot/i,
  /petalbot/i,
  /bytespider/i,
  /gptbot/i,
  /chatgpt-user/i,
  /claudebot/i,
  /anthropic-ai/i,
  /headlesschrome/i,
  /phantomjs/i,
  /selenium/i,
  /puppeteer/i,
  /playwright/i,
  /lighthouse/i,
  /pingdom/i,
  /uptimerobot/i,
  /statuscake/i,
  /curl\//i,
  /wget\//i,
  /python-requests/i,
  /go-http-client/i,
  /java\//i,
  /libwww-perl/i,
];

const HOSTING_ISP_PATTERN =
  /amazon|aws|google cloud|gcp|microsoft azure|digitalocean|ovh|hetzner|linode|vultr|datacenter|data center|hosting|cloudflare|fastly|akamai|cdn|m247|nordvpn|expressvpn|surfshark|proton|private internet|datacamp|contabo|leaseweb|choopa|psychz/i;

/** @param {Partial<{ userAgent: string, webdriver: boolean }>} deviceInfo */
export function detectBotSignals(deviceInfo = {}) {
  const reasons = [];
  let score = 0;
  const ua = deviceInfo.userAgent || (typeof navigator !== 'undefined' ? navigator.userAgent : '');

  if (deviceInfo.webdriver === true) {
    reasons.push('navigator.webdriver');
    score += 50;
  }

  for (const pattern of BOT_UA_PATTERNS) {
    if (pattern.test(ua)) {
      reasons.push(`ua:${pattern.source}`);
      score += 45;
      break;
    }
  }

  if (!reasons.some((r) => r.startsWith('ua:')) && /bot|crawl|spider|preview|scanner|archiver|slurp/i.test(ua)) {
    reasons.push('ua:generic-bot-keyword');
    score += 30;
  }

  if (typeof navigator !== 'undefined') {
    const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(ua);
    if (!isMobile && navigator.plugins?.length === 0 && /Chrome|Firefox|Safari|Edg/i.test(ua)) {
      reasons.push('desktop-without-plugins');
      score += 8;
    }
    if (navigator.languages?.length === 0) {
      reasons.push('no-languages');
      score += 10;
    }
  }

  const isLikelyBot = score >= 40;

  return {
    isLikelyBot,
    botScore: Math.min(score, 100),
    botReasons: reasons,
  };
}

export function parseIpinfoPrivacy(ipinfoData) {
  const privacy = ipinfoData?.privacy;
  if (!privacy) return {};

  return {
    isVpn: Boolean(privacy.vpn),
    isProxy: Boolean(privacy.proxy),
    isTor: Boolean(privacy.tor),
    isHosting: Boolean(privacy.hosting),
    isRelay: Boolean(privacy.relay),
    privacyService: privacy.service || null,
  };
}

export function hostingHeuristicFromIsp(isp) {
  if (!isp || isp === 'Unknown') return { isHosting: null };
  return { isHosting: HOSTING_ISP_PATTERN.test(isp) };
}

export function detectTimezoneMismatch(deviceTimezone, ipTimezone) {
  if (!deviceTimezone || !ipTimezone) return null;
  if (deviceTimezone === 'Unknown' || ipTimezone === 'Unknown') return null;
  return deviceTimezone !== ipTimezone;
}

/**
 * Merge client bot signals + IP privacy / heuristics into one object for Firestore.
 */
export function buildTrafficSignals({ deviceInfo, ipinfoData, location, deviceTimezone }) {
  const bot = detectBotSignals(deviceInfo);
  const fromIp = ipinfoData ? parseIpinfoPrivacy(ipinfoData) : {};
  const ispGuess = hostingHeuristicFromIsp(location?.isp);

  const isHosting =
    fromIp.isHosting === true ? true : fromIp.isHosting === false ? false : ispGuess.isHosting;

  const timezoneMismatch = detectTimezoneMismatch(
    deviceTimezone || deviceInfo?.timezone,
    location?.timezone || ipinfoData?.timezone
  );

  return {
    ...bot,
    isVpn: fromIp.isVpn ?? null,
    isProxy: fromIp.isProxy ?? null,
    isTor: fromIp.isTor ?? null,
    isHosting: isHosting ?? null,
    isRelay: fromIp.isRelay ?? null,
    privacyService: fromIp.privacyService ?? null,
    timezoneMismatch,
    /** Weak VPN hint when IP geo TZ ≠ browser TZ (not proof of VPN). */
    vpnHint:
      timezoneMismatch === true && fromIp.isVpn !== true ? 'timezone-mismatch' : null,
  };
}

/** For Traffic UI when older docs lack trafficSignals. */
export function getTrafficSignalsForVisitor(visitor) {
  if (visitor?.trafficSignals) return visitor.trafficSignals;
  if (visitor?.deviceInfo) {
    const partial = buildTrafficSignals({
      deviceInfo: visitor.deviceInfo,
      location: visitor.location,
      deviceTimezone: visitor.deviceInfo.timezone,
    });
    return partial;
  }
  return null;
}

export function trafficSignalBadges(signals) {
  if (!signals) return [];
  const badges = [];
  if (signals.isLikelyBot) badges.push({ key: 'bot', label: 'Bot', className: 'signal-bot' });
  if (signals.isVpn) badges.push({ key: 'vpn', label: 'VPN', className: 'signal-vpn' });
  else if (signals.vpnHint) badges.push({ key: 'vpn-hint', label: 'VPN?', className: 'signal-vpn-hint' });
  if (signals.isProxy) badges.push({ key: 'proxy', label: 'Proxy', className: 'signal-proxy' });
  if (signals.isTor) badges.push({ key: 'tor', label: 'Tor', className: 'signal-tor' });
  if (signals.isHosting) badges.push({ key: 'hosting', label: 'Hosting', className: 'signal-hosting' });
  return badges;
}
