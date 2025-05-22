// components/WaterLog.js
export default function WaterLog({ onAdd }) {
    return (
      <div className="space-x-2">
        {[250, 500, 750].map(amount => (
          <button key={amount} onClick={() => onAdd(amount)} className="px-4 py-2 bg-blue-500 text-white rounded">
            +{amount}ml
          </button>
        ))}
      </div>
    );
  }
  