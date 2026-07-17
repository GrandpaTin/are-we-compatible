import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import vm from "node:vm";

const root = resolve(new URL("../", import.meta.url).pathname.replace(/^\/(?:[A-Za-z]:)/, (match) => match.slice(1)));
const read = (path) => readFileSync(resolve(root, path), "utf8");
const html = read("index.html");
const manifest = JSON.parse(read("manifest.webmanifest"));
const importFixture = JSON.parse(read("tests/fixtures/import-smoke.json"));
const serviceWorker = read("sw.js");
const scripts = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)].map((match) => match[1]);

assert.equal(scripts.length, 2, "Expected one bundled QR script and one application script");
scripts.forEach((script, index) => assert.doesNotThrow(() => new vm.Script(script), `Inline script ${index + 1} must compile`));
assert.doesNotThrow(() => new vm.Script(serviceWorker), "Service worker must compile");

const arraySource = (name) => {
  const match = html.match(new RegExp(`const ${name} = (\\[[\\s\\S]*?\\n    \\]);`));
  assert(match, `Could not locate ${name}`);
  return vm.runInNewContext(match[1]);
};
const questions = [...arraySource("questionBank"), ...arraySource("specialtyQuestionBank")];
const ids = questions.map((question) => question.id);
assert(questions.length >= 200, "Question bank must contain at least 200 questions");
assert.equal(new Set(ids).size, ids.length, "Question IDs must be unique");
assert(questions.every((question) => ["text", "slider"].includes(question.type)), "Every question must use a supported input type");
assert(questions.every((question) => typeof question.prompt === "string" && question.prompt.trim().length >= 12), "Every question needs a meaningful prompt");
assert(questions.filter((question) => question.type === "slider").every((question) => Array.isArray(question.labels) && question.labels.length === 2 && question.labels.every(Boolean)), "Every slider needs two endpoint labels");
assert(questions.filter((question) => question.type === "slider").length > questions.filter((question) => question.type === "text").length * 0.7, "The catalog should remain slider-forward");

const qrContext = vm.createContext({});
vm.runInContext(scripts[0], qrContext);
const qr = qrContext.qrcode(0, "M");
qr.addData("https://example.test/are-we-compatible/#pair=production-check");
qr.make();
assert(qr.createSvgTag().includes("<svg"), "Bundled QR generation must produce an SVG");

const backupFunctionMatch = scripts[1].match(/function backupToState\(payload\) \{[\s\S]*?\n    \}\n\n    function exportBackup/);
assert(backupFunctionMatch, "Could not locate the backup import parser");
const backupToState = vm.runInNewContext(`(${backupFunctionMatch[0].replace(/\n\n    function exportBackup$/, "")})`);
const importedState = backupToState(importFixture);
assert.deepEqual(Array.from(importedState.names), ["Casey", "Riley"], "Backup import must restore both player names");
assert.equal(importedState.questionMode, "sliders-only", "Backup import must restore round settings");
assert.deepEqual(Array.from(importedState.favoriteQuestionIds), ["int_1"], "Backup import must restore library preferences");

const requiredFiles = ["index.html", "manifest.webmanifest", "sw.js", "icon-192.png", "icon-512.png", "og-image.jpg", "README.md", "LICENSE", ".nojekyll", "worker/src/index.js", "worker/wrangler.jsonc"];
requiredFiles.forEach((file) => assert(existsSync(resolve(root, file)), `Missing required file: ${file}`));
for (const icon of manifest.icons) {
  assert(icon.src.startsWith("./"), `Manifest icon path must be relative: ${icon.src}`);
  assert(existsSync(resolve(root, icon.src.slice(2))), `Manifest icon does not exist: ${icon.src}`);
}
assert.equal(manifest.scope, "./", "Manifest scope must support a GitHub Pages repository subfolder");
assert(manifest.start_url.startsWith("./"), "Manifest start URL must be relative");
assert.equal(importFixture.app, "Are We Compatible?", "Import fixture must target this application");
assert.equal(importFixture.formatVersion, 2, "Import fixture must exercise the current backup format");

const unsafeReferences = [/[A-Za-z]:\\\\/g, /(?:href|src)=["']\/(?!\/)/gi, /localhost(?::\d+)?/gi];
unsafeReferences.forEach((pattern) => assert(!pattern.test(html), `Found a deployment-unsafe reference matching ${pattern}`));
const secretPatterns = [/ghp_[A-Za-z0-9]{30,}/, /github_pat_[A-Za-z0-9_]{40,}/, /sk-[A-Za-z0-9]{30,}/, /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/];
for (const file of [html, serviceWorker, JSON.stringify(manifest)]) {
  secretPatterns.forEach((pattern) => assert(!pattern.test(file), `Potential secret detected: ${pattern}`));
}

assert(html.includes('lang="en"'), "The document must declare its language");
assert(html.includes('name="viewport"'), "The document must include a responsive viewport");
assert(html.includes('name="description"'), "The document must include a description");
assert(html.includes('property="og:image"'), "The document must include social sharing metadata");
assert(html.includes("backface-visibility: hidden"), "Reveal cards must preserve the 3D flip implementation");
assert(html.includes('class="card-face card-front"'), "Reveal card fronts must be real buttons");
assert(html.includes('aria-hidden="${!isFlipped}"'), "Unrevealed answer faces must be hidden from assistive technology");
assert(html.includes('id="answer-card-${escapedQuestionId}"'), "Reveal buttons must control identified answer regions");
assert(html.includes("unanswered questions are always chosen first"), "The freshness policy must remain visible to players");
assert(html.includes("const unanswered = questions.filter"), "Question selection must continue prioritizing unanswered prompts");
assert(html.includes('launchHashParams.get("join")'), "Two-phone mode must accept the one-scan room link");
assert(html.includes('window.addEventListener("hashchange", handleNearbyJoinLaunch)'), "A reused mobile browser tab must process newly scanned join links");
assert(html.includes("window.setTimeout(startNearbyRound, 650)"), "The host must start a connected private round automatically");
assert(html.includes("There is no second QR"), "The pairing interface must explain the one-scan flow");
assert(!html.includes("Scan response QR"), "The retired second-QR step must not return");
assert(html.includes('https://are-we-compatible-signal.bdaytin.workers.dev'), "Production signaling endpoint must be configured");
assert(!html.includes("__SIGNALING_SERVICE_URL__"), "A signaling placeholder must never reach production");

const sliderCount = questions.filter((question) => question.type === "slider").length;
const textCount = questions.length - sliderCount;
console.log(`Production checks passed: ${questions.length} questions (${sliderCount} sliders, ${textCount} written), ${manifest.icons.length} app icons, QR generation verified.`);
