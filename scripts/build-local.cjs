/* Dependency-free portable build. End users only need a modern browser. */
const fs = require("node:fs");
const path = require("node:path");
const zlib = require("node:zlib");

const root = path.resolve(__dirname, "..");
const outputDirectory = path.join(root, "dist");
const htmlFilename = "quarrel-trainer-local.html";
const zipFilename = "quarrel-trainer-local.zip";
const readText = (filename) =>
  fs.readFileSync(path.join(root, filename), "utf8").replace(/\r\n/g, "\n");

function replaceOnce(source, pattern, replacement, label) {
  const matches = source.match(new RegExp(pattern.source, "g"));
  if (matches?.length !== 1) {
    throw new Error(`Expected exactly one ${label} in index.html.`);
  }
  // A callback preserves literal $&, $` and $' in JavaScript and CSS sources.
  return source.replace(pattern, () => replacement);
}

function buildHtml() {
  let html = readText("index.html");
  // A local file cannot be installed as a PWA; keep its single-file behavior.
  html = html.replace(
    /<link\b[^>]*rel=["'](?:manifest|icon|apple-touch-icon)["'][^>]*>/g,
    "",
  );
  const css = readText("styles.css");
  html = replaceOnce(
    html,
    /<link\b[^>]*href=["']styles\.css["'][^>]*>/,
    `<style>\n${css.replace(/<\/style/gi, "<\\/style")}\n</style>`,
    "stylesheet reference",
  );
  for (const filename of ["i18n.js", "skills.js", "role-prompts.js", "pwa.js", "app.js"]) {
    const script = readText(filename);
    html = replaceOnce(
      html,
      new RegExp(
        `<script\\s+src=["']${filename.replace(".", "\\.")}["']\\s*>\\s*</script>`,
      ),
      `<script>\n${script.replace(/<\/script/gi, "<\\/script")}\n</script>`,
      filename,
    );
  }
  if (
    /<script\b[^>]*\bsrc\s*=|<link\b[^>]*\brel=["']stylesheet["']/i.test(html)
  ) {
    throw new Error(
      "Portable build still depends on external scripts or stylesheets.",
    );
  }
  return html;
}

// A small ZIP writer using the Node standard library: UTF-8 names, DEFLATE and CRC-32.
// No platform-specific archiver, package install or executable is needed to build.
const crcTable = Array.from({ length: 256 }, (_, index) => {
  let value = index;
  for (let bit = 0; bit < 8; bit++) {
    value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1;
  }
  return value >>> 0;
});
function crc32(bytes) {
  let value = 0xffffffff;
  for (const byte of bytes)
    value = crcTable[(value ^ byte) & 255] ^ (value >>> 8);
  return (value ^ 0xffffffff) >>> 0;
}
function createZip(entries) {
  const localParts = [],
    centralParts = [];
  let offset = 0;
  for (const [name, text] of entries) {
    const filename = Buffer.from(name, "utf8");
    const content = Buffer.from(text, "utf8");
    const compressed = zlib.deflateRawSync(content, { level: 9 });
    const crc = crc32(content);
    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0);
    local.writeUInt16LE(20, 4);
    local.writeUInt16LE(0x0800, 6);
    local.writeUInt16LE(8, 8);
    local.writeUInt16LE(0x21, 12); // Fixed DOS date: reproducible archives.
    local.writeUInt32LE(crc, 14);
    local.writeUInt32LE(compressed.length, 18);
    local.writeUInt32LE(content.length, 22);
    local.writeUInt16LE(filename.length, 26);
    const central = Buffer.alloc(46);
    central.writeUInt32LE(0x02014b50, 0);
    central.writeUInt16LE(20, 4);
    local.copy(central, 6, 4, 30);
    central.writeUInt32LE(offset, 42);
    localParts.push(local, filename, compressed);
    centralParts.push(central, filename);
    offset += local.length + filename.length + compressed.length;
  }
  const directory = Buffer.concat(centralParts);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(entries.length, 8);
  end.writeUInt16LE(entries.length, 10);
  end.writeUInt32LE(directory.length, 12);
  end.writeUInt32LE(offset, 16);
  return Buffer.concat([...localParts, directory, end]);
}

function build() {
  const html = buildHtml();
  const instructions = [
    "吵架练习器 · 本地便携版 / Boundary Lab · Portable edition",
    "QUICK START / 快速开始",
    "Extract the ZIP, then open Start.html. 解压后双击 Start.html。",
    "No installation or server. 无需安装程序或启动服务。",
    "Choose English or 中文 at the top. 首次跟随浏览器语言，随后记住你的选择。",
    "Fictional characters, original delivery, just for fun. 虚构角色，娱乐过招。",
    "",
    "【开始使用】",
    "1. 先把整个 ZIP 解压到本地文件夹，不要在压缩包预览里直接打开。",
    "2. 双击“Start.html”，使用 Edge、Chrome、Firefox 或 Safari 等现代浏览器打开。",
    "3. 点击“开始游戏”，选择对手和难度，即可练习。",
    "无需安装程序、Node.js、Python 或浏览器插件，也无需启动本地服务。",
    "HTML 已包含全部样式、脚本、中英文内容和明暗主题，可单独复制使用。",
    "可选预置离线 / AI 动态两种模式；难度与嘴辣程度分别选择。",
    "自定义玩法提供中英文原创虚构角色、示范和 JSON / Markdown 风格技能。",
    "只描述个性与表达特点，不模仿具体真人或影视角色，不照搬现成名台词。",
    "生成规则不能代替内容来源核查；导入内容请仅使用自有或已获授权的素材。",
    "导入附带的“Example-skill.json”即可体验离线技能台词；纯文字技能需 AI 才能生成。",
    "",
    "【离线与 AI】",
    "未配置 API 时，使用内置预置内容，可以断网练习、复盘和查看历史。",
    "若要每局动态生成新情境，请在设置中填写 API 地址、API Key 和模型。",
    "AI 模式需要联网，并要求服务商允许浏览器直接请求；失败时回退到预置内容。",
    "",
    "【记录与偏好】",
    "设置、档案和记录保存在所用浏览器中；建议固定文件位置并使用同一浏览器。",
    "移动或重命名 HTML、换浏览器、清理浏览器数据后，原记录可能不可见。",
    "如果浏览器禁止本地存储，应用会提示并改为仅本次会话保存。",
    "分享本文件不会带走你保存在浏览器中的 API Key 或练习记录。",
    "",
    "【Start】",
    "Extract the ZIP, then double-click Start.html in a modern browser.",
    "No installation, runtime, server, account or API key is required for preset practice.",
    "All styles, scripts, Chinese/English content and light/dark themes are embedded.",
    "Choose offline presets or AI mode, with independent difficulty and profanity levels.",
    "The comeback lab offers fictional characters, sample banter and JSON/Markdown style skills.",
    "Describe general traits, not real people or franchise characters. Do not copy catchphrases.",
    "Generation rules cannot verify rights. Import only your own or permission-cleared content.",
    "Import the included skill example to try offline skill lines; instruction-only skills need AI.",
    "Preset practice works offline. AI-generated sessions require an Internet connection",
    "and a complete API configuration whose provider allows direct browser requests.",
    "Settings and history are stored in your browser. Keep the file in a stable location.",
    "Moving the file or changing browsers may make earlier records unavailable.",
    "Sharing the HTML does not share your browser's saved key or practice history.",
    "",
  ].join("\r\n");
  fs.mkdirSync(outputDirectory, { recursive: true });
  const htmlPath = path.join(outputDirectory, htmlFilename);
  const zipPath = path.join(outputDirectory, zipFilename);
  fs.writeFileSync(htmlPath, html, "utf8");
  fs.writeFileSync(
    zipPath,
    createZip([
      ["quarrel-trainer-local/Start.html", html],
      ["quarrel-trainer-local/Readme.txt", "\ufeff" + instructions],
      [
        "quarrel-trainer-local/Example-skill.json",
        readText("skills/reviewer.json"),
      ],
    ]),
  );
  // Keep the ready-to-download GitHub package in sync with the generated build.
  const downloadDirectory = path.join(root, "downloads");
  fs.mkdirSync(downloadDirectory, { recursive: true });
  fs.copyFileSync(zipPath, path.join(downloadDirectory, zipFilename));
  return { htmlPath, zipPath };
}

if (require.main === module) {
  for (const [kind, filename] of Object.entries(build())) {
    console.log(`${kind}: ${filename} (${fs.statSync(filename).size} bytes)`);
  }
}
module.exports = { build, createZip };
