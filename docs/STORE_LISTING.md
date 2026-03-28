# Store Listing Draft

## Name
**Am I In a Meeting?**

## Short description
Detect meeting tabs and send webhook updates to your local or private network tools.

## Full description
**Am I In a Meeting?** detects whether your browser currently has a supported meeting tab open and can send meeting-state updates to a configured webhook URL.

Useful for:
- local automation
- status integrations
- private network tools
- meeting-aware workflows

## Features
- Detects supported meeting URLs in open tabs
- Simple popup showing current state and matched URL
- Configurable webhook URL
- Webhook on/off toggle
- Toolbar icon reflects meeting state and webhook state
- Supports local and private-network webhook targets

## Supported services
Currently supports URL-based detection for:
- Google Meet
- Zoom web
- Microsoft Teams web

## How it works
The extension checks open browser tabs for known meeting URL patterns. When the detected state changes, it can send a JSON webhook payload to the endpoint you configure.

## Privacy
The extension does not send data to the developer.
Webhook data is only sent to the URL explicitly configured by the user.

## Ideal users
This extension is intended for users who want to integrate browser meeting presence into local tools, private LAN services, or automation workflows.
