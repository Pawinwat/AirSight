// components/PipelineEye.tsx
import { format, parseISO, roundToNearestMinutes } from 'date-fns';
import * as echarts from 'echarts';
import { SeriesOption } from 'echarts';
import React, { CSSProperties } from 'react';
import { getStatusColor } from 'src/constant/colors';
import { DagRun } from 'src/types/airflow';
import BaseEChart from '../charts/base/Echart';

// Helper function to generate 24-hour time labels at 5-minute intervals
const generateDailyTimeLabels = (): string[] => {
  const labels: string[] = [];
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0); // Start at midnight

  for (let i = 0; i < 24 * 60; i += 5) {
    labels.push(format(currentDate, 'HH:mm:ss'));
    currentDate = new Date(currentDate.getTime() + 5 * 60 * 1000); // Increment by 5 minutes
  }

  return labels;
};

// Helper function to map DagRun data to the generated time labels
const mapDagRunDataToTimeLabels = (data: DagRun[], timeLabels: string[]): Record<string, string | number>[] => {
  const counts: Record<string, Record<string, number>> = {};

  // Count occurrences of execution_date rounded to the nearest 5 minutes
  data.forEach((item) => {
    const roundedDate = roundToNearestMinutes(parseISO(item.execution_date), { nearestTo: 5 });
    const timeString = format(roundedDate, 'HH:mm:ss');
    if (!counts[timeString]) {
      counts[timeString] = {}
    }
    if (!counts[timeString]?.[item?.state]) {
      counts[timeString][item?.state] = 0
    }
    counts[timeString]['total'] = (counts[timeString]['total'] || 0) + 1;
    counts[timeString][item?.state] = (counts[timeString][item?.state] || 0) + 1;

  });
  // Map the counts to the generated time labels
  return timeLabels.map((label) => {

    const succesRate = (counts[label]?.success / counts[label]?.total) * 100
    return {
      time: label,
      ...counts[label],
      succesRate: succesRate,
      failRate: 100 - succesRate
    }
  });
};

interface DagRunEyeProps {
  style?: CSSProperties;
  data: DagRun[];
  mode?: 'count' | 'state'
}

const DagRunEye: React.FC<DagRunEyeProps> = ({ style, data }: DagRunEyeProps) => {
  const timeLabels = generateDailyTimeLabels();
  const dagRunCounts = mapDagRunDataToTimeLabels(data, timeLabels);
  // const isCount = mode == 'count'
  // Define the series option
  const series: SeriesOption[] = [
    {
      type: 'bar',
      encode: { angle: 'time', radius: 'total' },
      // data: dagRunCounts?.map(rec=>rec?.total || 0),
      coordinateSystem: 'polar',
      label: { show: false },
      polarIndex: 0,
      itemStyle: {
        color: (params: any) => {
          const value = (params?.data?.total || 0) as number;
          // Set up color transition based on value range from green to yellow to red
          if (value < 5) {
            return `rgb(0, ${Math.floor((value / 1.33) * 255)}, 0)`; // Green
          } else if (value < 10) {
            const intensity = Math.floor(((value - 1.33) / 1.34) * 255);
            return `rgb(${intensity}, 255, 0)`; // Yellow
          } else {
            const intensity = Math.floor(((4 - value) / 1.33) * 255);
            return `rgb(255, ${intensity}, 0)`; // Red
          }
        },
      },
    },
    {
      type: 'bar',
      encode: { angle: 'time', radius: 'succesRate' },
      stack: 'status',
      // data: dagRunCounts?.map(rec => (Math.round((rec?.success as number) / (rec?.total as number)) * 100) || null),
      coordinateSystem: 'polar',
      label: { show: false },
      polarIndex: 1,
      itemStyle: {
        color: (params: any) => {
          const value = (params?.data?.succesRate || 0) as number;
          // Set up color transition based on value range from green to yellow to red
          if (value < 25) {
            return getStatusColor('failed')
          } else if (value < 100) {
            return getStatusColor('upstream_failed')
          } else {
            return getStatusColor('success')

          }
        },
      },
    },
    {
      type: 'bar',
      encode: { angle: 'time', radius: 'failRate' },
      stack: 'status',
      // data: dagRunCounts?.map(rec => (Math.round((rec?.success as number) / (rec?.total as number)) * 100) || null),
      coordinateSystem: 'polar',
      label: { show: false },
      polarIndex: 1,
      itemStyle: {
        color: (_params: any) => getStatusColor('failed')
      },
    },
  ];

  // Define the chart options
  const option: echarts.EChartsOption = {
    polar: [{ radius: ['10%', '60%'] }, { radius: ['70%', '90%'] }],
    radiusAxis: [{ polarIndex: 0 }, { polarIndex: 1 }],
    dataset: {
      dimensions: ['time', 'total', 'success', 'failed', 'running', 'succesRate', 'failRate'],
      source: dagRunCounts,
    },
    angleAxis: [
      {
        polarIndex: 0,
        type: 'category',
        data: timeLabels,
        startAngle: 90,
      },
      {
        polarIndex: 1,
        type: 'category',
        data: timeLabels,
        startAngle: 90,
        show: false
      }
    ],
    tooltip: {
      trigger: 'axis',
      // trigger: 'item',
      // formatter: '{b}: {c}',

    },
    series,
    animation: true,
  };

  return (
    <BaseEChart
      option={option}
      style={{
        height: '300px',
        width: '300px',
        ...style,
      }}
    />
  );
};

export default DagRunEye;
