export default function ReminderSettings({ startHour, endHour, setStartHour, setEndHour }) {
    return (
      <div className="mt-4">
        <label className="block mb-1 font-medium">Reminder Time Window</label>
        <div className="flex space-x-2">
          <input
            type="number"
            min="0" max="23"
            value={startHour}
            onChange={(e) => setStartHour(Number(e.target.value))}
            className="border p-1 rounded w-16"
            placeholder="Start"
          />
          <span className="self-center">to</span>
          <input
            type="number"
            min="0" max="23"
            value={endHour}
            onChange={(e) => setEndHour(Number(e.target.value))}
            className="border p-1 rounded w-16"
            placeholder="End"
          />
        </div>
      </div>
    );
  }
  