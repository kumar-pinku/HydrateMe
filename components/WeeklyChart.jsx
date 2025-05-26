import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function WeeklyChart({ hydrationLogs, goal }) {
  const today = new Date();
  const last7Days = [...Array(7)].map((_, i) => {
    const date = new Date(today);
    date.setDate(date.getDate() - (6 - i));
    const key = date.toISOString().split('T')[0];
    return {
      label: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      intake: hydrationLogs[key]?.intake || 0,
      metGoal: (hydrationLogs[key]?.intake || 0) >= goal,
    };
  });

  const data = {
    labels: last7Days.map(day => day.label),
    datasets: [
      {
        label: 'Water Intake (ml)',
        data: last7Days.map(day => day.intake),
        backgroundColor: last7Days.map(day =>
          day.metGoal ? 'rgba(34,197,94,0.8)' : 'rgba(239,68,68,0.8)'
        ),
        borderRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        suggestedMax: goal,
        ticks: {
          stepSize: 250,
        },
      },
    },
  };

  return (
    <div className="my-6 p-4 bg-blue-50 rounded-lg shadow">
      <h3 className="text-blue-900 font-semibold text-center mb-4">🧊 Weekly Hydration</h3>
      <Bar data={data} options={options} />
    </div>
  );
}
