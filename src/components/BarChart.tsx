import React, { FC } from 'react';
import { Bar } from 'react-chartjs-2';
import { ChartData, ChartOptions } from 'chart.js';
import type { NormalizedDataType } from '../normalizedData';

interface Props {
  data: NormalizedDataType[];
}
const BarChart: FC<Props> = ({ data }) => {
  const barData: ChartData<'bar'> = {
    labels: data.map((e) => e.key),
    datasets: [
      {
        label: 'Pending vs key',
        data: data.map((e) => e.pending),
        backgroundColor: 'red',
      },
    ],
  };

  const barOptions: ChartOptions<'bar'> = {
    plugins: {},
    scales: {
      x: {
        title: {
          display: true,
          text: '<key field>',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Pending Amount',
        },
      },
    },
  };
  return <Bar data={barData} options={barOptions} />;
};
export default BarChart;
