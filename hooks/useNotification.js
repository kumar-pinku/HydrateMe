export function useNotification(startHour = 8, endHour = 22) {
    const notify = (msg) => {
      const hour = new Date().getHours();
      if (hour >= startHour && hour <= endHour && Notification.permission === "granted") {
        new Notification(msg);
      }
    };
  
    const requestPermission = () => {
      if (Notification && Notification.permission !== "granted") {
        Notification.requestPermission();
      }
    };
  
    return { notify, requestPermission };
}