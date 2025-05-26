import Layout from '@/components/Layout';
import { useEffect, useState } from 'react';
import useHydrationTracker from '../hooks/useHydrationTracker';
import toast, { Toaster } from 'react-hot-toast';
import confetti from 'canvas-confetti';
import WeeklyChart from '../components/WeeklyChart';
import ReminderSchedule from '../components/ReminderSchedule';
import useHydrationNotifications from '../hooks/useHydrationNotifications';
import { requestNotificationToken } from '../lib/requestNotificationToken';

export default function Home() {
  const {
    intake,
    goal,
    goalCompleted,
    history,
    hydrationLogs,
    addWater,
    deleteEntry,
    toggleMenu,
    markGoalCompleted,
    setGoal,
  } = useHydrationTracker(1200);

  const [hasMounted, setHasMounted] = useState(false);
  const [streak, setStreak] = useState(1);
  const [cupSize, setCupSize] = useState(200);
  const [activeTab, setActiveTab] = useState('home');

  useHydrationNotifications(goalCompleted, goal, history);

  // ✅ Delay render until after client mount
  useEffect(() => {
    setHasMounted(true);
  }, []);

  // ✅ Request Notification permission once
  useEffect(() => {
    if (typeof window !== 'undefined' && Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  }, []);


  // ✅ Streak tracking
  useEffect(() => {
    if (!hasMounted) return;

    const today = new Date().toDateString();
    const lastLogged = localStorage.getItem('lastLogDate');
    const lastStreak = parseInt(localStorage.getItem('hydrationStreak')) || 1;

    if (lastLogged !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      if (lastLogged === yesterday.toDateString()) {
        setStreak(lastStreak + 1);
        localStorage.setItem('hydrationStreak', lastStreak + 1);
      } else {
        setStreak(1);
        localStorage.setItem('hydrationStreak', '1');
      }

      localStorage.setItem('lastLogDate', today);
    } else {
      setStreak(lastStreak);
    }
  }, [hasMounted]);

  const handleAddWater = () => {
    addWater(cupSize);

    if (intake + cupSize >= goal && !goalCompleted) {
      markGoalCompleted();
      triggerGoalCelebration();
    }
  };

  const triggerGoalCelebration = () => {
    toast.success('🎉 Hydration goal achieved!');
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });

    if (Notification.permission === 'granted') {
      new Notification('💧 Goal Completed', {
        body: `You've reached your daily hydration goal of ${goal}ml!`,
      });
    }
  };

  const percentage = Math.min((intake / goal) * 100, 100).toFixed(0);

  // ✅ Delay rendering until client
  if (!hasMounted) {
    return (
      <Layout>
        <div className="text-center text-gray-400 mt-10">Loading...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Toaster position="top-center" />
      <section className="min-h-[100dvh] px-4 pb-12">

        {/* 🔷 Tabs */}
        <div className="flex justify-around items-center mb-4 text-blue-600">
          {['home', 'history', 'settings'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-2 capitalize transition-all duration-150 ${activeTab === tab
                ? 'border-b-2 border-blue-500 font-bold text-blue-700'
                : 'opacity-60'
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* 💧 Home Tab */}
        {activeTab === 'home' && (
          <>
            {goalCompleted ? (
              <div className="text-green-600 text-sm font-semibold text-center mt-2">
                {"🎉 You've completed your hydration goal!"}
              </div>
            ) : (
              <div className="mb-2 text-blue-700 text-start">
                {"💧 You've stayed hydrated for "}<b>{streak} day{streak > 1 && 's'}</b>
              </div>
            )}

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

            <button
              onClick={handleAddWater}
              disabled={goalCompleted}
              className={`mt-2 mb-2 px-6 py-2 rounded-full shadow ${goalCompleted
                ? 'bg-green-400 text-white cursor-not-allowed'
                : 'bg-blue-500 text-white cursor-pointer'
                }`}
            >
              {goalCompleted ? 'Goal Completed' : `+ ${cupSize} ml`}
            </button>

            <p className="text-gray-500 text-xs mb-4">Confirm that you have just drunk water</p>

            <div className="mt-2 text-sm text-blue-800 flex flex-wrap items-center gap-2 justify-center">
              <span className="w-full sm:w-auto">Change cup:</span>
              {[200, 250, 300].map((size) => (
                <button
                  key={size}
                  onClick={() => setCupSize(size)}
                  className={`px-3 py-1 rounded border text-sm cursor-pointer transition ${cupSize === size
                    ? 'bg-blue-500 border-blue-400 text-white'
                    : 'border-blue-400 text-blue-700'
                    }`}
                >
                  {size} ml
                </button>
              ))}
            </div>

            {/* Records */}
            <ReminderSchedule
              history={history}
              reminderInterval={parseInt(localStorage.getItem('reminderInterval') || '60')}
              cupSize={cupSize}
              deleteEntry={deleteEntry}
              toggleMenu={toggleMenu}
            />
          </>
        )}

        {/* 📅 History Tab */}
        {activeTab === 'history' && (
          <div className="text-blue-800 space-y-4">
            <h2 className="text-center font-semibold text-lg mb-4">📅 Hydration History</h2>
            <WeeklyChart hydrationLogs={hydrationLogs} goal={goal} />
            {Object.entries(hydrationLogs)
              .sort(([a], [b]) => new Date(b) - new Date(a))
              .map(([date, log]) => (
                <div key={date} className="bg-blue-50 p-4 rounded shadow">
                  <div className="flex justify-between mb-1">
                    <span className="font-bold">{date}</span>
                    <span className={`${log.intake >= goal ? 'text-green-600' : 'text-red-500'} font-semibold`}>
                      {log.intake}ml
                    </span>
                  </div>
                  <ul className="text-sm space-y-1">
                    {log.history.map((item, i) => (
                      <li key={i} className="flex justify-between">
                        <span>🥤 {item.time}</span>
                        <span>{item.amount}ml</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
          </div>
        )}

        {/* ⚙️ Settings Tab */}
        {activeTab === 'settings' && (
          <div className="text-blue-800 max-w-md mx-auto mt-6">
            <h2 className="text-lg font-semibold mb-4 text-center">⚙️ App Settings</h2>
            <div className="mb-6">
              <label className="block mb-1 font-medium text-sm">Daily Hydration Goal (ml)</label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-blue-300 rounded"
                value={goal}
                onChange={(e) => {
                  const newGoal = parseInt(e.target.value);
                  if (!isNaN(newGoal)) setGoal(newGoal);
                }}
                min={200}
                step={100}
              />
            </div>
            <div className="mb-6 flex items-center justify-between">
              <span className="font-medium text-sm">Enable Reminders</span>
              <input
                type="checkbox"
                checked={localStorage.getItem('hydrationReminders') === 'true'}
                onChange={(e) => {
                  localStorage.setItem('hydrationReminders', e.target.checked);
                }}
                className="scale-125"
              />
            </div>
            <label className="block mb-1 font-medium text-sm">Reminder Interval (minutes)</label>
            <input
              type="number"
              min={15}
              step={15}
              defaultValue={parseInt(localStorage.getItem('reminderInterval')) || 60}
              onChange={(e) => localStorage.setItem('reminderInterval', e.target.value)}
              className="w-full px-3 py-2 border border-blue-300 rounded mb-6"
            />
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded"
              onClick={requestNotificationToken}
            >
              🔔 Enable Push Notifications
            </button>

          </div>
        )}
      </section>
    </Layout>
  );
}
