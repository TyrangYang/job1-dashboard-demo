import { FC } from 'react';

import { Scatter } from 'react-chartjs-2';
import { ChartData, ChartOptions } from 'chart.js';
import type { NormalizedDataType } from '../normalizedData';
import { useDataContext } from '../context/DataProvider';

interface Props {
  data: NormalizedDataType[];
}
const Chart: FC<Props> = ({ data }) => {
  const { allAvailableDimension } = useDataContext();
  const scatterData: ChartData<'scatter'> = {
    datasets: [
      {
        label: 'Pending vs key',
        data: data.map((e, idx) => ({
          x: idx,
          y: e.pending,
        })),
        backgroundColor: 'red',
      },
    ],
  };

  const scatterOptions: ChartOptions<'scatter'> = {
    plugins: {
      // legend: {
      //   position: 'left',
      // },
      tooltip: {
        callbacks: {
          label: (context) => {
            const dataPoint = data[context.parsed.x];
            return `${dataPoint.key}: ${context.parsed.y}`;
          },
        },
      },
    },
    scales: {
      x: {
        type: 'linear' as const,
        title: {
          display: true,
          text: '<key field>',
        },
        grid: {
          display: false,
        },
        ticks: {
          callback: function (value) {
            if (typeof value === 'string') return '';
            const item = data[value];
            console.log(item);
            if (item === undefined) return '';
            const label = allAvailableDimension.reduce((res, dim) => {
              if (res === '') return item[dim];
              return res + ' / ' + item[dim];
            }, '');
            return label;
          },
          stepSize: 1,
        },

        min: -1,
        max: data.length,
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Pending Amount',
        },
      },
    },
  };

  return (
    <>
      <Scatter data={scatterData} options={scatterOptions} />
    </>
  );
};
export default Chart;
