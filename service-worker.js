/* Generated from this template by scripts/build-h5.cjs. Cache static assets only. */
const BUILD_ID = "6e3092d3131f8b98";
const SHELL = ["./","index.html","styles.css","i18n.js","skills.js","role-prompts.js","pwa.js","app.js","manifest.webmanifest","manifest.zh.webmanifest","icons/icon.svg","icons/icon-192.png","icons/icon-512.png","icons/apple-touch-icon.png"];
const CACHE_PREFIX =
  "boundary-lab:" + new URL(self.registration.scope).pathname + ":";
const CACHE_NAME = CACHE_PREFIX + BUILD_ID;
const resolve = (path) => new URL(path, self.registration.scope).href;
const allowed = new Set(SHELL.map((path) => new URL(resolve(path)).pathname));
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      cache.addAll(
        SHELL.map((file) => new Request(resolve(file), { cache: "reload" })),
      ),
    ),
  );
});
self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      for (const key of await caches.keys()) {
        if (key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME)
          await caches.delete(key);
      }
      await self.clients.claim();
    })(),
  );
});
self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") self.skipWaiting();
});
self.addEventListener("fetch", (event) => {
  const request = event.request,
    url = new URL(request.url);
  if (request.method !== "GET" || url.origin !== self.location.origin) return;
  if (
    request.mode === "navigate" &&
    url.href.startsWith(self.registration.scope)
  ) {
    event.respondWith(
      caches
        .open(CACHE_NAME)
        .then(
          async (cache) =>
            (await cache.match(resolve("index.html"))) || fetch(request),
        ),
    );
    return;
  }
  if (allowed.has(url.pathname))
    event.respondWith(
      caches
        .open(CACHE_NAME)
        .then(
          async (cache) =>
            (await cache.match(request, { ignoreSearch: true })) ||
            fetch(request),
        ),
    );
});
