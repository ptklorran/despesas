import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import "./Chart.css";
Chart.register(...registerables);

interface Expense {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
}

interface ChartComponentProps {
  expenses: Expense[];
}

const ChartComponent: React.FC<ChartComponentProps> = ({ expenses }) => {
  const categories = ['casa', 'locomoção', 'lazer'];
  const data = {
    labels: categories,
    datasets: [
      {
        label: 'Categoria',
        data: categories.map(category => 
          expenses.filter(expense => expense.category === category)
            .reduce((total, expense) => total + expense.amount, 0)
        ),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      }
    ]
  };

  return <Bar data={data} />;
};

export default ChartComponent;
