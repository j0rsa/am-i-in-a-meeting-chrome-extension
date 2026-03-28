const SYNC_DEFAULTS = {
  webhookUrl: 'http://127.0.0.1:3847/meeting-state',
};

const LOCAL_DEFAULTS = {
  webhookEnabled: true,
};

async function getExtensionState() {
  try {
    const state = await chrome.runtime.sendMessage({ type: 'get-state' });
    return state || { atMeeting: false, lastUrl: null, webhookEnabled: true };
  } catch (_error) {
    return { atMeeting: false, lastUrl: null, webhookEnabled: true };
  }
}

async function loadPopup() {
  const syncSettings = await chrome.storage.sync.get(SYNC_DEFAULTS);
  const localSettings = await chrome.storage.local.get(LOCAL_DEFAULTS);
  const state = await getExtensionState();

  const stateEl = document.getElementById('state');
  stateEl.textContent = state.atMeeting ? 'In meeting' : 'Not in meeting';
  stateEl.className = `value state ${state.atMeeting ? 'on' : 'off'}`;

  document.getElementById('matchedUrl').textContent = state.lastUrl || '—';
  document.getElementById('webhookUrl').textContent = syncSettings.webhookUrl || SYNC_DEFAULTS.webhookUrl;
  document.getElementById('webhookEnabled').checked = (localSettings.webhookEnabled ?? state.webhookEnabled) !== false;
}

async function saveToggle() {
  const webhookEnabled = document.getElementById('webhookEnabled').checked;
  await chrome.storage.local.set({ webhookEnabled });
  try {
    await chrome.runtime.sendMessage({ type: 'webhook-enabled-changed', webhookEnabled });
  } catch (_error) {
    // Ignore if the background worker is restarting.
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('webhookEnabled').addEventListener('change', saveToggle);
  document.getElementById('refresh').addEventListener('click', loadPopup);
  document.getElementById('openSettings').addEventListener('click', (event) => {
    event.preventDefault();
    chrome.runtime.openOptionsPage();
  });
  loadPopup();
});
