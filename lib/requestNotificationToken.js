import { getClientMessaging } from './getClientMessaging';
import { getToken } from 'firebase/messaging';

export async function requestNotificationToken() {
  try {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') return;

    const messaging = await getClientMessaging();
    if (!messaging) return;

    const token = await getToken(messaging, {
      vapidKey: 'BNozMM8iGLXCVpy5TpG4JGdbeWVY4DIPzO6ry-NuVZtVZ5G6zyrzP9DtUpUaEtFp-gMbOr60whKtJR5M7c8YWF8',
    });

    if (token) {
      console.log("✅ FCM Token:", token);
      // send to backend
    }
  } catch (err) {
    console.error("❌ Failed to get token", err);
  }
}
