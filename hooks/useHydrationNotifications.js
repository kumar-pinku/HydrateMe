import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function useHydrationNotifications(goalCompleted, goal, history) {
    const [reminderInterval, setReminderInterval] = useState(60);
    const [lastDrinkTime, setLastDrinkTime] = useState(null);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        // Safely load reminder interval
        const storedInterval = parseInt(localStorage.getItem('reminderInterval')) || 60;
        setReminderInterval(storedInterval);

        // Set last drink time
        const last = history?.[0]?.timestamp || null;
        setLastDrinkTime(last);

        // If no nextReminderTime is set, initialize it now
        if (!localStorage.getItem('nextReminderTime')) {
            const nextTime = new Date(Date.now() + storedInterval * 60000).toISOString();
            localStorage.setItem('nextReminderTime', nextTime);
        }

        // Ask permission if not granted yet
        if (Notification.permission === 'default') {
            Notification.requestPermission();
        }

    }, [history]);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        if (goalCompleted || !reminderInterval) return;

        const checkReminder = () => {
            const now = Date.now();
            const lastDrink = lastDrinkTime ? new Date(lastDrinkTime).getTime() : 0;
            const nextReminder = new Date(localStorage.getItem('nextReminderTime')).getTime() || now;
            const interval = parseInt(localStorage.getItem('reminderInterval')) || 60;
            const shouldRemind = now >= nextReminder && now - lastDrink > 30 * 60 * 1000;
          
            if (shouldRemind) {
              // ✅ Trigger notification
              if (Notification.permission === 'granted') {
                new Notification('💧 Time to drink!', {
                  body: `You’re still below your ${goal}ml goal.`,
                });
              } else {
                toast('💧 Reminder: time to hydrate!');
              }
          
              // ✅ Reschedule next reminder from last one, not from now
              const newNext = new Date(nextReminder + interval * 60000).toISOString();
              localStorage.setItem('nextReminderTime', newNext);
            }
          };
          

        const intervalId = setInterval(checkReminder, 60 * 1000);
        return () => clearInterval(intervalId);
    }, [goalCompleted, lastDrinkTime, reminderInterval, goal]);

}
