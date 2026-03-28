const SYNC_DEFAULTS = {
  webhookUrl: 'http://127.0.0.1:3847/meeting-state',
};

const LOCAL_DEFAULTS = {
  webhookEnabled: true,
};

async function restore() {
  const syncSettings = await chrome.storage.sync.get(SYNC_DEFAULTS);
  const localSettings = await chrome.storage.local.get(LOCAL_DEFAULTS);
  document.getElementById('webhookUrl').value = syncSettings.webhookUrl;
  document.getElementById('webhookEnabled').checked = !!localSettings.webhookEnabled;
}

async function save() {
  const webhookUrl = document.getElementById('webhookUrl').value.trim() || SYNC_DEFAULTS.webhookUrl;
  const webhookEnabled = document.getElementById('webhookEnabled').checked;

  await chrome.storage.sync.set({ webhookUrl });
  await chrome.storage.local.set({ webhookEnabled });

  const status = document.getElementById('status');
  status.textContent = 'Saved.';
  setTimeout(() => {
    status.textContent = '';
  }, 1500);
}

document.getElementById('save').addEventListener('click', save);
document.addEventListener('DOMContentLoaded', restore);
