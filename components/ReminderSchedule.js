import { ClockIcon } from '@heroicons/react/24/outline';

import { useMemo } from 'react';

function getNextReminderTime(history, intervalMinutes) {
    if (!history || history.length === 0) return null;
  
    const lastTimeString = history[0]?.time;
    if (!lastTimeString) return null;
  
    // Use Date.parse as fallback (assuming it's in "hh:mm" format without AM/PM)
    let parsedDate;
  
    try {
      parsedDate = new Date(`1970-01-01T${lastTimeString}`);
      if (isNaN(parsedDate.getTime())) {
        // Fallback: try manual parsing if AM/PM format
        const [hourMinute, ampm] = lastTimeString.split(' ');
        if (!hourMinute || !ampm) return null;
        let [hours, minutes] = hourMinute.split(':').map(Number);
        if (ampm.toLowerCase() === 'pm' && hours !== 12) hours += 12;
        if (ampm.toLowerCase() === 'am' && hours === 12) hours = 0;
        parsedDate = new Date();
        parsedDate.setHours(hours);
        parsedDate.setMinutes(minutes);
        parsedDate.setSeconds(0);
      }
    } catch {
      return null;
    }
  
    // Add reminder interval
    const next = new Date(parsedDate.getTime() + intervalMinutes * 60 * 1000);
    return next.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  
export default function ReminderSchedule({ history, reminderInterval = 60, cupSize = 300, deleteEntry, toggleMenu }) {
  const nextTime = useMemo(() => getNextReminderTime(history, reminderInterval), [history, reminderInterval]);
  return (
    <div className="mt-6 text-left text-blue-800">
      <h2 className="text-blue-900 font-semibold mb-2 flex items-center">
        {"Today's records "}<span className="ml-1">+</span>
      </h2>

      <div className="bg-white shadow rounded-md divide-y max-h-[50vh] overflow-y-auto pr-1">
        {/* 🔔 Next Reminder */}
        {nextTime && (
          <div className="flex items-center justify-between p-4 bg-blue-50">
            <div className="flex items-center space-x-3">
              <ClockIcon className="w-5 h-5 text-gray-500" />
              <div>
                <div className="text-black font-medium">{nextTime}</div>
                <div className="text-xs text-gray-500">Next time</div>
              </div>
            </div>
            <div className="text-sm text-blue-800 font-semibold">{cupSize} ml</div>
          </div>
        )}

        {/* 🥤 Past Entries */}
        {history.map((entry, i) => (
          <div key={i} className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center space-x-3">
              <span role="img" aria-label="cup">🥤</span>
              <span>{entry.time}</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-sm">{entry.amount} ml</span>
              <div className="relative">
                <button
                  onClick={() => toggleMenu(i)}
                  className="text-gray-500 hover:text-blue-600 cursor-pointer"
                >
                  ⋮
                </button>
                {entry.showMenu && (
                  <div className="absolute right-2 top-0 bottom-0 h-[34px] bg-white border border-gray-200 shadow-lg rounded text-sm z-[999999] w-28">
                    <button
                      onClick={() => deleteEntry(i)}
                      className="block w-full text-left h-[34px] px-4 py-2 hover:bg-gray-100 text-red-500 cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
