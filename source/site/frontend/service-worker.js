// Inspired by https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Offline_Service_workers

self.addEventListener('install', (e) => {
  console.log('[Service Worker] Install');
  var cacheName = 'Tortellini Timer!';
  // found using `find . -type f -follow -print`
  var appShellFiles = [
    "/service-worker.js",
    "/css/analysis.css",
    "/css/time-picker.css",
    "/css/modal.css",
    "/css/settings.css",
    "/css/style.css",
    "/css/timer-display.css",
    "/css/task-input.css",
    "/css/task-item.css",
    "/css/control-button.css",
    "/css/timer.css",
    "/css/task-list.css",
    "/html/login.html",
    "/html/components/analysis.html",
    "/html/components/timer-display.html",
    "/html/components/control-button.html",
    "/html/components/time-picker.html",
    "/html/components/modal.html",
    "/html/components/task-item.html",
    "/html/components/settings.html",
    "/html/components/task-list.html",
    "/html/timer.html",
    "/js/components/iostimepicker.js",
    "/js/components/time-picker.js",
    "/js/components/analysis.js",
    "/js/components/component.template",
    "/js/components/control-button.js",
    "/js/components/incdecinput.js",
    "/js/components/jtest.template",
    "/js/components/modal.js",
    "/js/components/modal.test.js",
    "/js/components/settings.js",
    "/js/components/task-list-data.js",
    "/js/components/task-list.js",
    "/js/components/timer-display.js",
    "/js/components/sync.js",
    "/js/state_machines/task_state_machine.js",
    "/js/state_machines/state_machine.js",
    "/js/state_machines/timer_state_machine.js",
    "/js/timer.js",
    "/js/utils.js",
    "/assets/settings/avatar.png",
    "/assets/settings/dark.png",
    "/assets/settings/light.png",
    "/assets/settings/logo.jfif",
    "/assets/audio/spongebob-screaming-alarm-placeholder.mp3",
    "/assets/images/Ocean Cliffs Background.jfif",
    "/assets/images/doodle-bob-background-placeholder.jpg",
    "/assets/images/ocean-cliffs-background-2.jfif",
    "/assets/images/web-background.png"];

  e.waitUntil(
    caches.open(cacheName).then(function (cache) {
      console.log("caching...");
      return cache.addAll(appShellFiles);
    })
  );
});

self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request)
      .then(function (response) {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
      )
  );
});

self.addEventListener('activate', function (event) {
  var cacheWhitelist = ['example'];
  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames.map(function (cacheName) {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// self.addEventListener('fetch', (e) => {
//     console.log('ddd');
//     e.respondWith(
//         caches.match(e.request).then((r) => {
//             console.log('[Service Worker] Fetching resource: ' + e.request.url);
//             return r || fetch(e.request).then((response) => {
//                 return caches.open(cacheName).then((cache) => {
//                     console.log('[Service Worker] Caching new resource: ' + e.request.url);
//                     cache.put(e.request, response.clone());
//                     return response;
//                 });
//             });
//         })
//     );
// });