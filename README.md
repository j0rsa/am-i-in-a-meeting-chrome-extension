# Am I In a Meeting? Chrome Extension

Minimal MV3 extension that detects well-known meeting URLs and POSTs state changes to a localhost app.

## Current behavior

- Watches all browser tabs
- Marks `atMeeting=true` if any tab matches a known meeting URL
- Sends updates only when state changes
- Switches the toolbar icon between gray (idle) and red (meeting active)
- Shows a green outbound arrow on the icon when webhook is enabled
- Shows a diagonal slash on the icon when webhook is disabled
- Full webhook URL is configurable in settings
- Webhook enabled state is stored in local storage to avoid MV3 service worker sync glitches

## Supported URL patterns (v0)

- `https://meet.google.com/...` (excluding `https://meet.google.com/landing`)
- `https://*.zoom.us/j/...`
- `https://*.zoom.us/wc/...`
- `https://*.zoom.us/s/...`
- `https://teams.microsoft.com/...`

## Callback payload

```json
{
  "browserInstanceId": "uuid",
  "browserName": "AmIAtMeeting",
  "atMeeting": true,
  "url": "https://meet.google.com/abc-defg-hij",
  "reason": "tab-updated",
  "timestamp": "2026-03-23T12:00:00.000Z"
}
```

## Load locally

1. Open `chrome://extensions`
2. Enable Developer Mode
3. Click `Load unpacked`
4. Select this folder
