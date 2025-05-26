// lib/getClientMessaging.js
import { getMessaging, isSupported } from 'firebase/messaging';
import { app } from './firebase';

export const getClientMessaging = async () => {
  if (typeof window === 'undefined') return null;

  const supported = await isSupported();
  if (!supported) return null;

  try {
    return getMessaging(app);
  } catch (err) {
    console.error("💥 Failed to get messaging", err);
    return null;
  }
};
