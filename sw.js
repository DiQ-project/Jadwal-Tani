importScripts(
  "https://www.gstatic.com/firebasejs/12.18.0/firebase-app-compat.js"
);

importScripts(
  "https://www.gstatic.com/firebasejs/12.18.0/firebase-messaging-compat.js"
);

const firebaseConfig = { 
  apiKey : "AIzaSyCP-zxg8IHmG-8b04m99SMn5BAWszsspoA" , 
  authDomain : "jadwal-tani.firebaseapp.com" , 
  projectId : "jadwal-tani" , 
  storageBucket : "jadwal-tani.firebasestorage.app" , 
  messagingSenderId : "667160800975" , 
  appId : "1:667160800975:web:820b58405abe10dd2491ba" 
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

const CACHE = "jadwal-tani-v6";

const ASSETS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icons/icon-192.png",
  "./icons/icon-512.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(ASSETS))
  );

  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE)
          .map(key => caches.delete(key))
      )
    )
  );

  self.clients.claim();
});

self.addEventListener("fetch", event => {

  // Untuk halaman dan file aplikasi:
  // ambil versi terbaru dari server terlebih dahulu.
  if (
    event.request.method === "GET" &&
    (
      event.request.destination === "document" ||
      event.request.destination === "script" ||
      event.request.destination === "style"
    )
  ) {

    event.respondWith(
      fetch(event.request)
        .then(response => {

          const copy = response.clone();

          caches.open(CACHE).then(cache => {
            cache.put(event.request, copy);
          });

          return response;

        })
        .catch(() => {
          return caches.match(event.request);
        })
    );

    return;
  }

  // File lainnya tetap cache-first
  event.respondWith(
    caches.match(event.request)
      .then(cached => {

        return cached ||
          fetch(event.request);

      })
  );

});


/* ========================= */
/* NOTIFIKASI */
/* ========================= */

messaging.onBackgroundMessage(payload => {

  const notification =
    payload.notification || {};

  self.registration.showNotification(
    notification.title || "Jadwal Tani 🌱",
    {
      body:
        notification.body ||
        "Ada jadwal tani untukmu.",
      icon: "./icons/icon-192.png",
      badge: "./icons/icon-192.png",
      tag: "jadwal-tani-fcm",
      renotify: true
    }
  );

});

self.addEventListener("message", event => {

  if (
    event.data?.type === "SHOW_NOTIFICATION"
  ) {

    event.waitUntil(

      self.registration.showNotification(
        event.data.title || "Jadwal Tani ",
        {
          body:
            event.data.body ||
            "Ada jadwal tani untukmu.",

          icon:
            "./icons/icon-192.png",

          badge:
            "./icons/icon-192.png",

          tag:
            "jadwal-tani",

          renotify:
            true
        }
      )

    );

  }

});


/* ========================= */
/* KLIK NOTIFIKASI */
/* ========================= */

self.addEventListener(
  "notificationclick",
  event => {

    event.notification.close();

    event.waitUntil(

      clients
        .matchAll({
          type: "window",
          includeUncontrolled: true
        })
        .then(list => {

          if(list.length){

            return list[0].focus();

          }

          return clients.openWindow("./");

        })

    );

  }
);