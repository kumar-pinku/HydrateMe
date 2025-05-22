// components/DailyProgress.js
export default function DailyProgress({ intake, goal }) {
    const percent = Math.min((intake / goal) * 100, 100);
  
    return (
      <div className="my-4">
        <div className="text-sm mb-1">{intake}ml / {goal}ml</div>
        <div className="w-full h-4 bg-gray-200 rounded">
          <div className="h-full bg-blue-500 rounded" style={{ width: `${percent}%` }} />
        </div>
      </div>
    );
  }
  