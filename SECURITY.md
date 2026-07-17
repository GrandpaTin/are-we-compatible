# Security and privacy

Are We Compatible? is a static, local-first application. It has no account system, analytics service, advertising SDK, or application server. Answers remain in the browser's local storage unless a player explicitly exports a backup or uses the direct nearby-phone transfer.

## Important privacy notes

- Anyone with access to the same browser profile can potentially access locally saved answers.
- The optional local PIN is a privacy speed bump for a shared device, not a substitute for operating-system security or full database encryption.
- Nearby mode uses a direct WebRTC data channel and deliberately does not configure public relay servers. It is intended for devices on a compatible local network.
- Exported JSON backups may contain personal answers. Store and share them carefully. Encrypted `.awc` backups are preferred for sensitive data.

## Reporting a vulnerability

Please open a private GitHub security advisory for the repository rather than posting sensitive details in a public issue. Include reproduction steps, affected browsers, and the potential impact. Do not include real relationship answers or exported save files.
