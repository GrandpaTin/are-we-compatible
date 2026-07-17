import assert from "node:assert/strict";
import signalingWorker from "../worker/src/index.js";

class FakeRoomStub {
  constructor() {
    this.configuration = null;
  }

  async fetch(input, options = {}) {
    const url = new URL(input);
    if (url.pathname === "/create") {
      this.configuration = JSON.parse(options.body);
      return new Response(JSON.stringify({ ok: true }), { status: 201 });
    }
    if (url.pathname === "/validate-join") {
      const { token } = JSON.parse(options.body);
      if (!this.configuration || Date.now() >= this.configuration.expiresAt) return new Response(null, { status: 410 });
      return new Response(null, { status: token === this.configuration.joinToken ? 200 : 403 });
    }
    return new Response(null, { status: 404 });
  }
}

const rooms = new Map();
const env = {
  ALLOWED_ORIGINS: "https://grandpatin.github.io,http://127.0.0.1:4174",
  PAIRING_ROOMS: {
    getByName(roomId) {
      if (!rooms.has(roomId)) rooms.set(roomId, new FakeRoomStub());
      return rooms.get(roomId);
    }
  },
  ROOM_RATE_LIMITER: { async limit() { return { success: true }; } }
};

const call = (path, options = {}) => signalingWorker.fetch(new Request(`https://signal.example${path}`, {
  ...options,
  headers: { origin: "https://grandpatin.github.io", ...(options.headers || {}) }
}), env);

const health = await call("/health");
assert.equal(health.status, 200, "Signaling health endpoint must respond");

const blocked = await signalingWorker.fetch(new Request("https://signal.example/api/rooms", {
  method: "POST",
  headers: { origin: "https://untrusted.example" }
}), env);
assert.equal(blocked.status, 403, "Untrusted browser origins must be rejected");

const missingOrigin = await signalingWorker.fetch(new Request("https://signal.example/api/rooms", { method: "POST" }), env);
assert.equal(missingOrigin.status, 403, "Room creation must require an approved browser origin");

const created = await call("/api/rooms", { method: "POST" });
assert.equal(created.status, 201, "A temporary room must be created");
const room = await created.json();
assert.match(room.roomId, /^[A-Za-z0-9_-]{16,40}$/, "Room ID must be URL-safe and unguessable");
assert(room.hostToken.length >= 40 && room.joinToken.length >= 40, "Pairing tokens must have sufficient entropy");
assert(room.expiresAt > Date.now() && room.expiresAt <= Date.now() + 16 * 60 * 1000, "Room must expire promptly");
assert(Array.isArray(room.iceServers) && room.iceServers.length, "Room must include ICE discovery configuration");

const invalidJoin = await call(`/api/rooms/${room.roomId}/join`, {
  method: "POST",
  body: JSON.stringify({ token: "not-the-token" })
});
assert.equal(invalidJoin.status, 403, "Invalid join tokens must be rejected");

const validJoin = await call(`/api/rooms/${room.roomId}/join`, {
  method: "POST",
  body: JSON.stringify({ token: room.joinToken })
});
assert.equal(validJoin.status, 200, "The QR join token must open its room");
const joinPayload = await validJoin.json();
assert.equal(joinPayload.roomId, room.roomId, "Join response must target the created room");

console.log("Signaling checks passed: origin protection, expiring rooms, strong tokens, and one-scan join validation verified.");
