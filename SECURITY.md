# Security and privacy

Aligned is a local-first application with no account system, analytics service, or advertising SDK. Answers remain in browser storage unless a player explicitly exports a backup or sends them to their partner over the encrypted WebRTC data channel.

## Important privacy notes

- Anyone with access to the same browser profile can potentially access locally saved answers.
- The optional local PIN is a privacy speed bump for a shared device, not a substitute for operating-system security or full database encryption.
- Nearby mode uses a short-lived signaling room to exchange WebRTC connection metadata automatically. The room expires after 15 minutes and does not receive questions or answers as application data.
- A configured TURN service may relay encrypted WebRTC packets when a direct route is unavailable. Like any network service, signaling and relay providers can observe connection metadata such as IP addresses, timing, and traffic volume, but WebRTC encryption prevents them from reading the answer payload.
- A QR join link is a temporary bearer credential. Do not post it publicly; create a new room if it is shared with the wrong person.
- Exported JSON backups may contain personal answers. Store and share them carefully. New encrypted `.aligned` backups are preferred for sensitive data; legacy `.awc` backups remain importable.

## Reporting a vulnerability

Please open a private GitHub security advisory for the repository rather than posting sensitive details in a public issue. Include reproduction steps, affected browsers, and the potential impact. Do not include real relationship answers or exported save files.
