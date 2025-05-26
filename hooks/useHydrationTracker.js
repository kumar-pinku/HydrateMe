import { useState, useEffect } from 'react';

export default function useHydrationTracker(defaultGoal = 1200) {
  const todayKey = new Date().toISOString().split('T')[0];
  
  // 🧠 Safely load hydration logs from localStorage
  const [hydrationLogs, setHydrationLogs] = useState(() => {
    if (typeof window !== 'undefined') {
      return JSON.parse(localStorage.getItem('hydrationLogs') || '{}');
    }
    return {};
  });

  // ✅ Goal with localStorage support
  const [goal, setGoal] = useState(() => {
    if (typeof window !== 'undefined') {
      const storedGoal = localStorage.getItem('hydrationGoal');
      return storedGoal ? parseInt(storedGoal) : defaultGoal;
    }
    return defaultGoal;
  });

  const [goalCompleted, setGoalCompleted] = useState(false);

  // 💧 Derived for today
  const todayData = hydrationLogs[todayKey] || { intake: 0, history: [] };
  const intake = todayData.intake || 0;
  const history = todayData.history || [];

  // 🧠 Save hydration logs to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('hydrationLogs', JSON.stringify(hydrationLogs));
    }
  }, [hydrationLogs]);

  // 💾 Save goal to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('hydrationGoal', goal);
    }
  }, [goal]);

  // 🎯 Update goal completed state if intake changes
  useEffect(() => {
    setGoalCompleted(intake >= goal);
  }, [intake, goal]);

  // ➕ Add water
  const addWater = (amount) => {
    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const updatedHistory = [{ time, amount, showMenu: false }, ...history];
    const updatedIntake = intake + amount;

    setHydrationLogs((prev) => ({
      ...prev,
      [todayKey]: {
        intake: updatedIntake,
        history: updatedHistory,
      }
    }));
  };

  // ❌ Delete water entry
  const deleteEntry = (index) => {
    const entry = history[index];
    if (!entry) return;

    const updatedHistory = history.filter((_, i) => i !== index);
    const updatedIntake = Math.max(0, intake - entry.amount);

    setHydrationLogs((prev) => ({
      ...prev,
      [todayKey]: {
        intake: updatedIntake,
        history: updatedHistory,
      }
    }));

    if (updatedIntake < goal) {
      setGoalCompleted(false);
    }
  };

  // 🔄 Toggle entry menu
  const toggleMenu = (index) => {
    const updatedHistory = history.map((entry, i) => ({
      ...entry,
      showMenu: i === index ? !entry.showMenu : false,
    }));

    setHydrationLogs((prev) => ({
      ...prev,
      [todayKey]: {
        intake,
        history: updatedHistory,
      }
    }));
  };

  // ✅ Manually mark goal as completed
  const markGoalCompleted = () => setGoalCompleted(true);

  return {
    intake,
    goal,
    goalCompleted,
    history,
    hydrationLogs, // use this in history view
    addWater,
    deleteEntry,
    toggleMenu,
    markGoalCompleted,
    setGoal, // for settings
  };
}
