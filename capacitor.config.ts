import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.jadwaltani.app',
  appName: 'Jadwal Tani',
  webDir: 'www',
  plugins: {
    LocalNotifications: {
      smallIcon: 'ic_launcher',
      iconColor: '#2f7d32'
    }
  }
};

export default config;
