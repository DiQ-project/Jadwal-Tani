import { LocalNotifications } from '@capacitor/local-notifications';

const STORAGE_KEY = 'jadwalTaniNativeNotificationIds';

const BASE_ID = 100000;


/* ================================= */
/* SIMPAN ID NOTIFIKASI */
/* ================================= */

function getStoredIds(){

  try{

    return JSON.parse(
      localStorage.getItem(
        STORAGE_KEY
      ) || '[]'
    );

  }catch(e){

    return [];

  }

}


function saveStoredIds(ids){

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(ids)
  );

}


/* ================================= */
/* IZIN NOTIFIKASI */
/* ================================= */

async function requestNotificationPermission(){

  const permission =
    await LocalNotifications.requestPermissions();

  return permission.display === 'granted';

}


/* ================================= */
/* AKTIFKAN NOTIFIKASI */
/* ================================= */

window.enableNativeNotifications =
async function(){

  try{

    const granted =
      await requestNotificationPermission();


    if(!granted){

      alert(
        'Izin notifikasi belum diberikan.'
      );

      return;

    }


    alert(
      'Notifikasi Android berhasil diaktifkan 🔔🌱'
    );


    if(
      typeof window.allOccurrences ===
      'function'
    ){

      const occurrences =
        window.allOccurrences(60)
          .filter(x=>{

            const completedId =
              x.index +
              '|' +
              x.date;

            const completed =
              JSON.parse(
                localStorage.getItem(
                  'jadwalTaniCompleted'
                ) || '{}'
              );

            return !completed[completedId];

          });


      await window.syncNativeNotifications(
        occurrences
      );

    }

  }

  catch(error){

    console.error(
      'Local Notification Error:',
      error
    );


    alert(
      'Gagal mengaktifkan notifikasi Android.'
    );

  }

};


/* ================================= */
/* TES NOTIFIKASI */
/* ================================= */

window.testNotification =
async function(){

  try{

    const granted =
      await requestNotificationPermission();


    if(!granted){

      alert(
        'Izin notifikasi belum diberikan.'
      );

      return;

    }


    await LocalNotifications.schedule({

      notifications:[
        {

          id:
            99999,

          title:
            'Jadwal Tani 🌱',

          body:
            'Tes berhasil! Notifikasi Android sudah bekerja 🔔',

          schedule:{
            at:
              new Date(
                Date.now() + 3000
              )
          }

        }

      ]

    });


    alert(
      'Notifikasi dijadwalkan. Tunggu sekitar 3 detik 🔔'
    );

  }

  catch(error){

    console.error(
      'Local Notification Error:',
      error
    );


    alert(
      'Gagal membuat notifikasi Android.'
    );

  }

};


/* ================================= */
/* SINKRONISASI SEMUA JADWAL */
/* ================================= */

window.syncNativeNotifications =
async function(occurrences){

  try{

    const permission =
      await LocalNotifications.checkPermissions();


    if(
      permission.display !==
      'granted'
    ){

      return;

    }


    /* ----------------------------- */
    /* HAPUS JADWAL NOTIFIKASI LAMA */
    /* ----------------------------- */

    const oldIds =
      getStoredIds();


    if(
      oldIds.length > 0
    ){

      try{

        await LocalNotifications.cancel({

          notifications:
            oldIds.map(id=>({
              id:Number(id)
            }))

        });

      }

      catch(error){

        console.log(
          'Cancel old notifications:',
          error
        );

      }

    }


    saveStoredIds([]);


    /* ----------------------------- */
    /* WAKTU SEKARANG */
    /* ----------------------------- */

    const currentTime =
      new Date();


    /* ----------------------------- */
    /* FILTER JADWAL */
    /* ----------------------------- */

    const future =
      (occurrences || [])
        .filter(x=>{

          if(
            !x ||
            !x.date ||
            !x.time
          ){

            return false;

          }


          const dateTime =
            new Date(
              x.date +
              'T' +
              x.time +
              ':00'
            );


          return (
            !isNaN(
              dateTime.getTime()
            ) &&
            dateTime >
            currentTime
          );

        });


    /* ----------------------------- */
    /* BATASI JUMLAH */
    /* ----------------------------- */

    const selected =
      future.slice(
        0,
        100
      );


    if(
      selected.length === 0
    ){

      return;

    }


    /* ----------------------------- */
    /* BUAT NOTIFIKASI */
    /* ----------------------------- */

    const notifications =
      selected.map(
        (x,i)=>{

          const id =
            BASE_ID + i;


          const dateTime =
            new Date(
              x.date +
              'T' +
              x.time +
              ':00'
            );


          let body =
            'Waktunya ' +
            x.task.activity +
            ' — ' +
            x.task.plant;


          if(
            x.task.detail
          ){

            body +=
              ' • ' +
              x.task.detail;

          }


          return{

            id:id,

            title:
              'Jadwal Tani 🌱',

            body:body,

            schedule:{
              at:dateTime
            }

          };

        }
      );


    /* ----------------------------- */
    /* JADWALKAN */
    /* ----------------------------- */

    await LocalNotifications.schedule({

      notifications:
        notifications

    });


    /* ----------------------------- */
    /* SIMPAN ID */
    /* ----------------------------- */

    saveStoredIds(
      notifications.map(
        x=>x.id
      )
    );


    console.log(
      'Notifikasi native dijadwalkan:',
      notifications.length
    );

  }

  catch(error){

    console.error(
      'Sync Native Notifications Error:',
      error
    );

  }

};


/* ================================= */
/* SINKRONISASI SAAT APLIKASI MULAI */
/* ================================= */

setTimeout(
  ()=>{

    if(
      typeof window.allOccurrences ===
      'function'
    ){

      const occurrences =
        window.allOccurrences(60);


      window.syncNativeNotifications(
        occurrences
      );

    }

  },
  1000
);
