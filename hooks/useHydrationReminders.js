import { useEffect } from "react";


export default function useHydrationReminders(goalCompleted, goal, lastDrinkTimestamp) {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const enabled = localStorage.getItem('hydrationReminders') === 'true';
    const interval = parseInt(localStorage.getItem('reminderInterval')) || 60;
    const minGap = 30; // minutes since last drink before reminding

    if (!enabled || goalCompleted) return;

    const sendNotification = () => {
      const last = new Date(lastDrinkTimestamp);
      const now = new Date();
      const minutesSinceLastDrink = (now - last) / 60000;

      if (minutesSinceLastDrink < minGap) return; // ⛔ Skip if user drank recently

      if (Notification.permission === 'granted') {
        new Notification('💧 Time to drink!', {
          body: `It's been ${Math.round(minutesSinceLastDrink)} min since your last drink.`,
        });
      }
    };

    const intervalId = setInterval(() => {
      if (!goalCompleted && Notification.permission === 'granted') {
        sendNotification();
      }
    }, interval * 60 * 1000);

    return () => clearInterval(intervalId);
  }, [goalCompleted, goal, lastDrinkTimestamp]);
}
