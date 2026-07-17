# One-scan pairing service

This Cloudflare Worker provides short-lived WebSocket signaling rooms for the two-phone game. It exchanges WebRTC connection metadata only. Game questions and answers continue over the encrypted WebRTC data channel and are not stored by this service.

Rooms use unguessable host and join tokens, accept at most one browser per role, expire after 15 minutes, and use Durable Object WebSocket hibernation.

## Required production setup

1. Deploy with `wrangler deploy --config worker/wrangler.jsonc`.
2. Create a Cloudflare Realtime TURN key.
3. Store its values as Worker secrets named `TURN_KEY_ID` and `TURN_KEY_API_TOKEN`.
4. Put the deployed Worker origin in `SIGNALING_SERVICE_URL` inside `index.html`.

Without TURN secrets the service remains functional and uses public STUN discovery, but a TURN relay is strongly recommended for cellular networks, VPNs, guest Wi-Fi, and restrictive NATs.
