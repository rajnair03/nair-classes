const CACHE_NAME = "tuition-app-v1";

const urlsToCache = [
  "login.html",
  "dashboard.html",
  "index.html",
  "attendance.html",
  "fees.html",
  "style.css",
  "script.js"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});