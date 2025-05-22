import Layout from '@/components/Layout';
import { useState } from 'react';

export default function Home() {
  const [intake, setIntake] = useState(0);
  const [goal] = useState(1200);
  const [cupSize, setCupSize] = useState(100);
  // const [history, setHistory] = useState([{ time: '08:30', amount: 100 }]);
  const [history, setHistory] = useState([
    { time: '08:30', amount: 100, showMenu: false },
  ]);


  const addWater = () => {
    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setIntake(prev => prev + cupSize);
    // setHistory([{ time, amount: cupSize }, ...history]);
    setHistory([{ time, amount: cupSize, showMenu: false }, ...history]);

  };

  const percentage = Math.min((intake / goal) * 100, 100).toFixed(0);

  return (
    <Layout>
      <section className='min-h-[100dvh]'>
        <div className="mb-2 text-blue-700 text-start">
          {"💧 You've stayed hydrated for "}<b>3 days</b>
        </div>

        {/* Circular Progress */}
        <div className="relative w-40 h-40 mx-auto my-4">
          <svg className="transform -rotate-90" width="160" height="160">
            <circle cx="80" cy="80" r="70" stroke="#e0f2fe" strokeWidth="15" fill="none" />
            <circle
              cx="80"
              cy="80"
              r="70"
              stroke="#3b82f6"
              strokeWidth="15"
              strokeDasharray={440}
              strokeDashoffset={440 - (440 * percentage) / 100}
              strokeLinecap="round"
              fill="none"
            />
          </svg>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-800 text-lg font-bold">
            {intake}/{goal}ml
            <div className="text-xs font-normal">Daily Drink Target</div>
          </div>
        </div>

        {/* Log Water Button */}
        <button
          onClick={addWater}
          className="mt-2 mb-2 bg-blue-500 text-white px-6 py-2 rounded-full shadow cursor-pointer"
        >
          + {cupSize} ml
        </button>

        <p className="text-gray-500 text-xs mb-4">Confirm that you have just drunk water</p>

        {/* Cup Selector */}
        <div className="mt-2 text-sm text-blue-800 flex justify-start items-center space-x-2">
          <span>Change cup:</span>
          {[100, 150, 200].map(size => (
            <button
              key={size}
              onClick={() => setCupSize(size)}
              className={`px-3 py-1 rounded border cursor-pointer ${cupSize === size
                ? 'bg-blue-500 text-white'
                : 'border-blue-400 text-blue-700'
                }`}
            >
              {size} ml
            </button>
          ))}
        </div>

        {/* Records */}
        <div className="mt-6 text-left">
  <h2 className="text-blue-900 font-semibold mb-2">{"Today's records +"}</h2>

  {/* Scroll wrapper */}
  <div className="max-h-[50vh] min-h-[50vh] overflow-y-auto pr-1 text-blue-500">
    <ul className="space-y-2 relative">
      {history.map((entry, i) => (
        <li
          key={i}
          className="flex justify-between items-center bg-blue-50 p-2 rounded shadow-sm relative"
        >
          <div className="flex items-center space-x-2">
            <span role="img" aria-label="glass">🥤</span>
            <span>{entry.time}</span>
          </div>

          <div className="flex items-center space-x-2">
            <span>{entry.amount}ml</span>

            {/* More Menu */}
            <div className="relative">
              <button
                onClick={() =>
                  setHistory(prev =>
                    prev.map((item, idx) =>
                      idx === i
                        ? { ...item, showMenu: !item.showMenu }
                        : { ...item, showMenu: false }
                    )
                  )
                }
                className="text-blue-500 hover:text-blue-700 px-2"
              >
                ⋮
              </button>

              {entry.showMenu && (
                <div className="absolute right-0 top-6 bg-white border border-gray-200 shadow-lg rounded text-sm z-[9999999] w-28">
                  <button
                    onClick={() =>
                      setHistory(prev => prev.filter((_, idx) => idx !== i))
                    }
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        </li>
      ))}
    </ul>
  </div>
</div>


      </section>
    </Layout>
  );
}
