import { LocalNotifications } from '@capacitor/local-notifications';

window.enableNativeNotifications = async function () {
  try {
    const permission = await LocalNotifications.requestPermissions();

    if (permission.display !== 'granted') {
      alert('Izin notifikasi belum diberikan.');
      return;
    }

    alert('Notifikasi Android berhasil diaktifkan 🔔🌱');
  } catch (error) {
    console.error('Local Notification Error:', error);
    alert('Gagal mengaktifkan notifikasi Android.');
  }
};

window.testNativeNotification = async function () {
  try {
    const permission = await LocalNotifications.requestPermissions();

    if (permission.display !== 'granted') {
      alert('Izin notifikasi belum diberikan.');
      return;
    }

    await LocalNotifications.schedule({
      notifications: [
        {
          id: 999,
          title: 'Jadwal Tani 🌱',
          body: 'Tes berhasil! Notifikasi Android sudah bekerja 🔔',
          schedule: {
            at: new Date(Date.now() + 2000)
          }
        }
      ]
    });

    alert('Notifikasi dijadwalkan. Tunggu sekitar 2 detik 🔔');
  } catch (error) {
    console.error('Local Notification Error:', error);
    alert('Gagal membuat notifikasi Android.');
  }
};
