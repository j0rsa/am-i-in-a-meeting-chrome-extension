# Permissions Audit

## `tabs`
**Why needed:**
To inspect open tab URLs and determine whether any tab matches a supported meeting URL.

**Risk level:** medium
Because tab access is sensitive in store review terms.

**Mitigation:**
The extension uses tab URLs only for meeting detection and popup display. It does not send all tabs anywhere.

## `storage`
**Why needed:**
To save:
- webhook URL
- webhook enabled/disabled state
- browser instance ID

**Risk level:** low

## Host permissions: meeting sites
- `https://meet.google.com/*`
- `https://*.zoom.us/*`
- `https://teams.microsoft.com/*`

**Why needed:**
To recognize supported meeting URLs.

**Risk level:** medium
Because host permissions always attract reviewer attention.

**Mitigation:**
Limited to known meeting providers only.

## Host permissions: webhook targets
- `http://127.0.0.1/*`
- `http://localhost/*`
- `http://10.*/*`
- `http://192.168.*/*`

**Why needed:**
To allow webhook POST requests to localhost and private-network services configured by the user.

**Risk level:** medium
Because network access is sensitive, even on private ranges.

**Mitigation:**
Restricted to local/private network destinations instead of arbitrary internet-wide URLs.

## Reviewer-sensitive areas
The two biggest things to explain clearly in store review are:
1. why `tabs` is needed
2. why private-network webhook host permissions are needed
