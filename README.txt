JADWAL TANI V4 — PWA + NOTIFIKASI

Isi paket:
- index.html
- manifest.webmanifest
- sw.js
- icons/icon-192.png
- icons/icon-512.png

CARA UJI:
1. PWA membutuhkan HTTPS (atau localhost). Membuka index.html langsung sebagai file biasa tidak cukup untuk Service Worker.
2. Upload seluruh isi folder ini ke hosting statis HTTPS, misalnya GitHub Pages, Netlify, Vercel, atau hosting sendiri.
3. Buka alamat HTTPS tersebut di Chrome Android.
4. Pilih "Tambahkan ke layar utama" / "Install app".
5. Di aplikasi, tekan "Aktifkan" pada bagian Pengingat lalu izinkan notifikasi.
6. Tekan "Tes Notifikasi" untuk memastikan izin dan Service Worker bekerja.

CATATAN TEKNIS:
Versi V4 ini sudah menyiapkan fondasi PWA dan notifikasi Service Worker. Pengingat terjadwal lokal saat aplikasi benar-benar ditutup/background penuh tidak dijamin oleh browser. Untuk notifikasi yang benar-benar andal pada jam tertentu meski aplikasi tidak dibuka, versi produksi perlu Web Push + server (atau dibungkus menjadi aplikasi Android native). Fondasi data dan jadwal sudah disiapkan agar bisa dikembangkan ke sana.
