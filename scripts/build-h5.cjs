const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const { createZip } = require("./build-local.cjs");
const root = path.resolve(__dirname, "..");
const assets = [
  "index.html",
  "styles.css",
  "i18n.js",
  "skills.js",
  "role-prompts.js",
  "pwa.js",
  "app.js",
  "manifest.webmanifest",
  "manifest.zh.webmanifest",
  "icons/icon.svg",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "icons/apple-touch-icon.png",
];
function assetBytes(file) {
  const bytes = fs.readFileSync(path.join(root, file));
  return /\.png$/i.test(file)
    ? bytes
    : Buffer.from(bytes.toString("utf8").replace(/\r\n/g, "\n"));
}
function build() {
  const hash = crypto.createHash("sha256");
  for (const file of [...assets, "scripts/service-worker-template.js"])
    hash.update(file).update(assetBytes(file));
  const version = hash.digest("hex").slice(0, 16);
  const template = assetBytes("scripts/service-worker-template.js").toString(
    "utf8",
  );
  const worker = template
    .replace("__BUILD_ID__", version)
    .replace("__SHELL_FILES__", JSON.stringify(["./", ...assets]));
  fs.writeFileSync(path.join(root, "service-worker.js"), worker);
  const directory = path.join(root, "dist", "h5");
  fs.mkdirSync(directory, { recursive: true });
  const entries = [];
  for (const file of [...assets, "service-worker.js", ".nojekyll"]) {
    const data = assetBytes(file);
    const target = path.join(directory, file);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, data);
    entries.push(["quarrel-trainer-h5/" + file, data]);
  }
  const instructions =
    "Boundary Lab / 吵架练习器 — Installable H5\n\nUpload the contents of quarrel-trainer-h5 to an HTTPS static website, keeping the directory structure. Open that URL on a phone and choose Install to home screen.\n首次联网打开并缓存后可离线练习。AI 模式仍需联网。安装需要 HTTPS，不能从 file:// 或普通手机局域网 HTTP 地址安装。\nAndroid: browser menu → Install app / Add to home screen.\niPhone: Safari → Share → Add to Home Screen.\nVersion: " +
    version +
    "\n";
  entries.push(["quarrel-trainer-h5/Readme.txt", Buffer.from(instructions)]);
  const zipPath = path.join(root, "dist", "quarrel-trainer-h5.zip");
  fs.writeFileSync(zipPath, createZip(entries));
  fs.mkdirSync(path.join(root, "downloads"), { recursive: true });
  fs.copyFileSync(
    zipPath,
    path.join(root, "downloads", "quarrel-trainer-h5.zip"),
  );
  return { directory, zipPath, version };
}
if (require.main === module) console.log(build());
module.exports = { build, assets };
