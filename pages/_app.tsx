import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect } from "react";

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/firebase-messaging-sw.js')
        .then(() => console.log('Service worker registered'))
        .catch(err => console.error('SW error', err));
    }
  }, []);
  
  return <Component {...pageProps} />;
}
