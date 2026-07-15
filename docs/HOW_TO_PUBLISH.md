# How to Publish "Am I In a Meeting?" on the Chrome Web Store

This extension is close to publishable. The core MV3 code, popup, settings page, and draft store copy already exist. What remains is mostly packaging, assets, compliance, and dashboard work.

## What is still missing

### Required before submission

| Item | Status | Action |
|------|--------|--------|
| **128×128 store icon** | Missing | Add PNG icons and an `icons` entry in `manifest.json` (16, 48, 128). Runtime canvas icons in `icon.js` are not enough for the listing. |
| **Hosted privacy policy URL** | Draft only | Publish `docs/PRIVACY_POLICY.md` to a public URL. Replace `[YOUR CONTACT EMAIL HERE]` with a real contact address. |
| **Screenshots** | Missing | Capture at least one screenshot of the popup and/or settings page (1280×800 or 640×400). |
| **Developer account** | Unknown | Register at [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole) ($5 one-time fee). |
| **Upload ZIP** | Not built | Zip the extension files (exclude `.git`, docs if you prefer a slimmer package). |
| **Privacy / data usage form** | Not filled | Declare tab URL access and user-configured webhook POSTs in the dashboard. |
| **Permission justifications** | Draft only | Paste explanations from `docs/PERMISSIONS_AUDIT.md` when reviewers ask about `tabs` and private-network host permissions. |

### Recommended before submission

| Item | Status | Action |
|------|--------|--------|
| **Version bump** | `0.1.0` | Move to `1.0.0` when feature-complete. |
| **`action.default_icon`** | Missing | Point to static PNGs so the toolbar icon appears before the service worker starts. |
| **Support / homepage URL** | Missing | Add a GitHub repo or support page link in the store listing. |
| **End-to-end testing** | Checklist open | Walk through `docs/PUBLISH_CHECKLIST.md`: fresh install, upgrade, webhook on/off, tab refresh. |
| **Store description** | Draft ready | Proofread `docs/STORE_LISTING.md` and paste into the dashboard. |

### Review-sensitive areas

Reviewers will scrutinize two things in particular:

1. **`tabs` permission** — The extension reads open tab URLs to detect meetings. It does not exfiltrate all tabs; it only matches known meeting patterns and optionally POSTs state to a user-configured endpoint.
2. **Private-network host permissions** — `127.0.0.1`, `localhost`, `10.*`, and `192.168.*` are required so users can point webhooks at local automation (Home Assistant, Node-RED, etc.). The extension does not POST to arbitrary internet hosts.

Meeting-site host permissions (`meet.google.com`, `zoom.us`, `teams.microsoft.com`) are declared but the extension does not inject scripts into those pages; detection is URL-pattern based via `tabs`.

## Step-by-step publish flow

### 1. Finish the extension package

1. Create static icons at 16×16, 48×48, and 128×128 pixels.
2. Add to `manifest.json`:

```json
"icons": {
  "16": "icons/icon16.png",
  "48": "icons/icon48.png",
  "128": "icons/icon128.png"
},
"action": {
  "default_icon": {
    "16": "icons/icon16.png",
    "48": "icons/icon48.png"
  }
}
```

3. Bump `"version"` in `manifest.json`.
4. Run through `docs/PUBLISH_CHECKLIST.md`.

### 2. Prepare compliance materials

1. Host the privacy policy (GitHub Pages, your site, etc.).
2. Finalize store copy from `docs/STORE_LISTING.md`.
3. Take screenshots of the popup (meeting on/off) and settings page.

### 3. Build the upload ZIP

From the extension root:

```bash
zip -r am-i-in-a-meeting.zip . \
  -x "*.git*" \
  -x "docs/*" \
  -x "*.DS_Store"
```

Include: `manifest.json`, `background.js`, `icon.js`, `popup.html`, `popup.js`, `options.html`, `options.js`, and the `icons/` folder.

### 4. Submit in the Developer Dashboard

1. **New item** → upload the ZIP.
2. **Store listing** — name, short description (≤132 chars), full description, category (Productivity or Developer Tools), icon, screenshots.
3. **Privacy** — link to hosted privacy policy; declare that the extension accesses tab URLs and sends data only to the user-configured webhook.
4. **Permissions justification** — explain `tabs` (meeting detection) and host permissions (webhook targets + meeting URL recognition). Use `docs/PERMISSIONS_AUDIT.md`.
5. **Distribution** — public or unlisted, as you prefer.
6. **Submit for review** — first review often takes a few days.

### 5. After approval

- Tag the release in git.
- Monitor reviews and support email.
- For updates: bump version, rebuild ZIP, upload new package.

## Webhook contract (for downstream automation)

When webhook sending is **enabled**, state changes POST JSON like:

```json
{
  "browserInstanceId": "uuid",
  "browserName": "Am I In a Meeting?",
  "atMeeting": true,
  "url": "https://meet.google.com/abc-defg-hij",
  "reason": "tab-updated",
  "timestamp": "2026-03-23T12:00:00.000Z"
}
```

When the user **turns the webhook off**, the extension sends one final POST (while the URL is still configured):

```json
{
  "browserInstanceId": "uuid",
  "browserName": "Am I In a Meeting?",
  "atMeeting": false,
  "url": null,
  "reason": "webhook-disabled",
  "downstreamAutomation": false,
  "timestamp": "2026-03-23T12:00:00.000Z"
}
```

`downstreamAutomation: false` tells local automations (e.g. turning off a status bulb) not to act on this browser instance until webhook sending is re-enabled.

## Quick reference

| Resource | Location |
|----------|----------|
| Pre-publish checklist | `docs/PUBLISH_CHECKLIST.md` |
| Store listing draft | `docs/STORE_LISTING.md` |
| Privacy policy draft | `docs/PRIVACY_POLICY.md` |
| Permission justifications | `docs/PERMISSIONS_AUDIT.md` |
| Developer Dashboard | https://chrome.google.com/webstore/devconsole |
