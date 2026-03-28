# Privacy Policy for "Am I In a Meeting?"

**Effective date:** 2026-03-28

## Overview
**Am I In a Meeting?** is a browser extension that detects whether the browser currently has a tab open matching known meeting URLs and optionally sends meeting-state updates to a webhook URL configured by the user.

## What the extension does
The extension:
- checks open tab URLs against known meeting URL patterns
- determines whether the browser appears to be in a meeting
- updates the extension icon and popup UI
- optionally sends a webhook callback to a user-configured endpoint

## Data the extension accesses
The extension may access:
- open tab URLs, only to determine whether they match supported meeting services
- user-configured settings, such as:
  - webhook URL
  - whether webhook sending is enabled

## Data the extension may send
If webhook sending is enabled, the extension may send the following to the configured webhook URL:
- browser instance identifier
- extension/browser name
- whether a meeting is currently detected
- matched meeting URL
- event reason
- timestamp

## Data storage
The extension stores:
- webhook URL in browser sync storage
- webhook enabled/disabled state in browser local storage
- a browser instance identifier in browser local storage

The extension does not operate a remote backend of its own.

## Data sharing
The extension does not send data to the developer by default.

Data is only sent to the webhook URL explicitly configured by the user.

## Analytics and tracking
The extension does not include analytics, advertising, or tracking code.

## User control
Users can:
- disable webhook sending at any time
- change the configured webhook URL
- remove the extension at any time

## Contact
For questions about this extension or this privacy policy, contact:
**[YOUR CONTACT EMAIL HERE]**
