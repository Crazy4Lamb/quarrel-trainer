/* Installation is optional. File:// portable builds never register a worker. */
const mobileApp = {
  prompt: null,
  registration: null,
  ready: false,
  failed: false,
  updating: false,
  started: false,
  installed: false,
};
function installedApp() {
  return (
    mobileApp.installed ||
    matchMedia("(display-mode: standalone)").matches ||
    navigator.standalone === true
  );
}
function webAppContext() {
  return /^https?:$/.test(location.protocol) && window.isSecureContext;
}
function renderMobileApp() {
  const standalone = installedApp();
  document.documentElement.dataset.installed = String(standalone);
  const manifest = document.querySelector('link[rel="manifest"]');
  if (manifest)
    manifest.setAttribute(
      "href",
      language === "zh" ? "manifest.zh.webmanifest" : "manifest.webmanifest",
    );
  document.querySelector('meta[name="apple-mobile-web-app-title"]').content =
    t("brand");
  document.getElementById("btn-install-home").hidden = standalone;
  document.getElementById("btn-install-settings").textContent = t(
    standalone ? "pwaInstalled" : "pwaInstall",
  );
  const key = !webAppContext()
    ? "pwaFileStatus"
    : mobileApp.failed || !("serviceWorker" in navigator)
      ? "pwaCacheFailed"
      : mobileApp.ready
        ? "pwaOfflineReady"
        : "pwaPreparing";
  document.getElementById("pwa-status").textContent = t(key);
  document.getElementById("pwa-update").hidden =
    !mobileApp.registration?.waiting;
  document.getElementById("pwa-update-note").textContent = t("pwaUpdateNote");
  if (document.getElementById("pwa-install-dialog").open) renderInstallHelp();
}
function renderInstallHelp() {
  const ua = navigator.userAgent;
  const ios =
    /iPad|iPhone|iPod/.test(ua) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const embedded = /MicroMessenger|FBAN|FBAV|Instagram|\bQQ\//i.test(ua);
  const key = !webAppContext()
    ? "pwaFileHelp"
    : installedApp()
      ? "pwaInstalledHelp"
      : embedded
        ? "pwaEmbeddedHelp"
        : ios
          ? "pwaIOSHelp"
          : /Android/i.test(ua)
            ? "pwaAndroidHelp"
            : "pwaDesktopHelp";
  document.getElementById("pwa-install-help").textContent = t(key);
  document.getElementById("pwa-open-online").hidden = webAppContext();
}
async function installMobileApp() {
  if (mobileApp.prompt && !installedApp()) {
    const event = mobileApp.prompt;
    mobileApp.prompt = null;
    try {
      await event.prompt();
      await event.userChoice;
    } catch (_) {
      /* Manual instructions remain available. */
    }
    renderMobileApp();
    return;
  }
  renderInstallHelp();
  document.getElementById("pwa-install-dialog").showModal();
}
function initializeMobileApp() {
  if (mobileApp.started) return;
  mobileApp.started = true;
  document.getElementById("btn-install-home").onclick = installMobileApp;
  document.getElementById("btn-install-settings").onclick = installMobileApp;
  document.getElementById("btn-close-install").onclick = () =>
    document.getElementById("pwa-install-dialog").close();
  document
    .getElementById("pwa-install-dialog")
    .addEventListener("click", (event) => {
      if (event.target === event.currentTarget) {
        const box = event.currentTarget.getBoundingClientRect();
        if (
          event.clientX < box.left ||
          event.clientX > box.right ||
          event.clientY < box.top ||
          event.clientY > box.bottom
        )
          event.currentTarget.close();
      }
    });
  document.getElementById("btn-update-pwa").onclick = () => {
    if (battle && !battle.over && (battle.turn > 0 || battle.busy)) {
      document.getElementById("pwa-update-note").textContent =
        t("pwaFinishRound");
      return;
    }
    if (!mobileApp.registration?.waiting) return;
    mobileApp.updating = true;
    mobileApp.registration.waiting.postMessage({ type: "SKIP_WAITING" });
  };
  window.addEventListener("appinstalled", () => {
    mobileApp.installed = true;
    mobileApp.prompt = null;
    renderMobileApp();
  });
  initializeMobileViewport();
  renderMobileApp();
  if (!webAppContext() || !("serviceWorker" in navigator)) return;
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    mobileApp.ready = true;
    if (mobileApp.updating) location.reload();
    else renderMobileApp();
  });
  navigator.serviceWorker
    .register("./service-worker.js", { scope: "./", updateViaCache: "none" })
    .then((registration) => {
      mobileApp.registration = registration;
      if (registration.active) {
        mobileApp.ready = true;
        renderMobileApp();
      }
      registration.addEventListener("updatefound", () => {
        const worker = registration.installing;
        worker?.addEventListener("statechange", () => {
          if (worker.state === "redundant" && !registration.active) {
            mobileApp.failed = true;
            renderMobileApp();
          }
          if (worker.state === "installed") renderMobileApp();
        });
      });
      navigator.serviceWorker.ready.then(() => {
        mobileApp.ready = true;
        renderMobileApp();
      });
      renderMobileApp();
    })
    .catch(() => {
      if (navigator.serviceWorker.controller) mobileApp.ready = true;
      else mobileApp.failed = true;
      renderMobileApp();
    });
}
function initializeMobileViewport() {
  const viewport = window.visualViewport;
  if (!viewport) return;
  let width = window.innerWidth,
    baseline = window.innerHeight;
  const update = () => {
    const focused = document.activeElement?.matches("input, textarea, select");
    if (window.innerWidth !== width || !focused) {
      width = window.innerWidth;
      baseline = Math.max(window.innerHeight, viewport.height);
    }
    const keyboard = !!focused && viewport.height < baseline * 0.78;
    document.documentElement.dataset.keyboardOpen = String(keyboard);
    const inset = keyboard
      ? Math.max(0, window.innerHeight - viewport.height - viewport.offsetTop)
      : 0;
    document.documentElement.style.setProperty(
      "--keyboard-offset",
      inset + "px",
    );
  };
  viewport.addEventListener("resize", update);
  viewport.addEventListener("scroll", update);
  document.addEventListener("focusin", update);
  document.addEventListener("focusout", () => setTimeout(update, 0));
  update();
}
window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  mobileApp.prompt = event;
});
