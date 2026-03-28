import { applyMeetingIcon } from './icon.js';

const SYNC_DEFAULTS = {
  webhookUrl: 'http://127.0.0.1:3847/meeting-state',
};

const LOCAL_DEFAULTS = {
  webhookEnabled: true,
};

const state = {
  browserInstanceId: null,
  atMeeting: false,
  lastUrl: null,
  webhookEnabled: true,
};

const MEETING_PATTERNS = [
  /^https:\/\/meet\.google\.com\/[a-z-]+(?:[/?#].*)?$/i,
  /^https:\/\/([a-z0-9-]+\.)?zoom\.us\/(j|wc|s)\//i,
  /^https:\/\/teams\.microsoft\.com\//i,
];

let settingsReadyPromise = null;

async function getSyncSettings() {
  const stored = await chrome.storage.sync.get(SYNC_DEFAULTS);
  return { ...SYNC_DEFAULTS, ...stored };
}

async function getLocalSettings() {
  const stored = await chrome.storage.local.get(LOCAL_DEFAULTS);
  return { ...LOCAL_DEFAULTS, ...stored };
}

async function ensureSettingsReady() {
  if (!settingsReadyPromise) {
    settingsReadyPromise = (async () => {
      const syncSettings = await getSyncSettings();
      const localSettings = await getLocalSettings();
      state.webhookEnabled = localSettings.webhookEnabled !== false;
      return { ...syncSettings, ...localSettings };
    })();
  }
  return settingsReadyPromise;
}

async function refreshSettingsCache() {
  settingsReadyPromise = null;
  return ensureSettingsReady();
}

function randomId() {
  return crypto.randomUUID();
}

async function ensureBrowserInstanceId() {
  if (state.browserInstanceId) return state.browserInstanceId;
  const { browserInstanceId } = await chrome.storage.local.get('browserInstanceId');
  if (browserInstanceId) {
    state.browserInstanceId = browserInstanceId;
    return browserInstanceId;
  }
  const id = randomId();
  await chrome.storage.local.set({ browserInstanceId: id });
  state.browserInstanceId = id;
  return id;
}

function isMeetingUrl(url) {
  if (!url) return false;
  if (/^https:\/\/meet\.google\.com\/landing(?:[/?#].*)?$/i.test(url)) return false;
  return MEETING_PATTERNS.some((pattern) => pattern.test(url));
}

async function getAllTabUrls() {
  const tabs = await chrome.tabs.query({});
  return tabs.map((tab) => tab.url).filter((url) => typeof url === 'string');
}

async function computeMeetingState() {
  const urls = await getAllTabUrls();
  const activeUrl = urls.find((url) => isMeetingUrl(url)) ?? null;
  return {
    atMeeting: activeUrl !== null,
    url: activeUrl,
  };
}

async function renderIcon() {
  await applyMeetingIcon(state.atMeeting, state.webhookEnabled);
}

async function postState(reason) {
  const settings = await ensureSettingsReady();
  state.webhookEnabled = settings.webhookEnabled !== false;
  if (!state.webhookEnabled || !settings.webhookUrl) return;

  const browserInstanceId = await ensureBrowserInstanceId();
  const browserName = chrome.runtime.getManifest().name;

  const payload = {
    browserInstanceId,
    browserName,
    atMeeting: state.atMeeting,
    url: state.lastUrl,
    reason,
    timestamp: new Date().toISOString(),
  };

  try {
    await fetch(settings.webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    console.warn('Failed to post meeting state', error);
  }
}

async function refreshState(reason = 'refresh') {
  await ensureSettingsReady();
  const next = await computeMeetingState();
  const changed = next.atMeeting !== state.atMeeting || next.url !== state.lastUrl;

  state.atMeeting = next.atMeeting;
  state.lastUrl = next.url;

  await renderIcon();

  if (changed) {
    await postState(reason);
  }
}

chrome.runtime.onInstalled.addListener(async () => {
  await ensureBrowserInstanceId();
  const currentSync = await chrome.storage.sync.get(SYNC_DEFAULTS);
  await chrome.storage.sync.set({ ...SYNC_DEFAULTS, ...currentSync });
  const currentLocal = await chrome.storage.local.get(LOCAL_DEFAULTS);
  await chrome.storage.local.set({ ...LOCAL_DEFAULTS, ...currentLocal });
  await refreshSettingsCache();
  await refreshState('installed');
});

chrome.runtime.onStartup.addListener(async () => {
  await ensureBrowserInstanceId();
  await refreshSettingsCache();
  await refreshState('startup');
});

chrome.tabs.onUpdated.addListener(async (_tabId, changeInfo) => {
  if (changeInfo.url || changeInfo.status === 'complete') {
    await refreshState('tab-updated');
  }
});

chrome.tabs.onRemoved.addListener(async () => {
  await refreshState('tab-removed');
});

chrome.tabs.onActivated.addListener(async () => {
  await refreshState('tab-activated');
});

chrome.windows.onFocusChanged.addListener(async () => {
  await refreshState('window-focus-changed');
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type === 'get-state') {
    sendResponse({
      browserInstanceId: state.browserInstanceId,
      atMeeting: state.atMeeting,
      lastUrl: state.lastUrl,
      webhookEnabled: state.webhookEnabled,
    });
    return true;
  }

  if (message?.type === 'webhook-enabled-changed') {
    state.webhookEnabled = message.webhookEnabled !== false;
    chrome.storage.local.set({ webhookEnabled: state.webhookEnabled })
      .then(() => refreshSettingsCache())
      .then(() => renderIcon())
      .then(() => sendResponse({ ok: true }))
      .catch(() => sendResponse({ ok: false }));
    return true;
  }

  return false;
});

chrome.storage.onChanged.addListener(async (changes, area) => {
  if (area === 'local' && 'webhookEnabled' in changes) {
    state.webhookEnabled = changes.webhookEnabled.newValue !== false;
    await refreshSettingsCache();
    await renderIcon();
  }
});
