// hooks/useWaterTracker.js
import { useState, useEffect } from 'react';

const STORAGE_KEY = 'hydrationData';

export function useWaterTracker() {
  const [intake, setIntake] = useState(0);
  const [goal, setGoal] = useState(2000);
  const [unit, setUnit] = useState('ml'); // 'ml' or 'oz'

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    const today = new Date().toDateString();
    if (saved?.date === today) {
      setIntake(saved.intake);
      setGoal(saved.goal || 2000);
      setUnit(saved.unit || 'ml');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      date: new Date().toDateString(),
      intake,
      goal,
      unit
    }));
  }, [intake, goal, unit]);

  const convert = (val) => (unit === 'ml' ? val : (val / 29.574).toFixed(1)); // ml to oz

  return {
    intake: convert(intake),
    goal: convert(goal),
    setGoal: (val) => setGoal(unit === 'ml' ? val : val * 29.574),
    unit,
    setUnit,
    addWater: (amount) => setIntake((prev) => prev + (unit === 'ml' ? amount : amount * 29.574)),
    reset: () => setIntake(0)
  };
}
