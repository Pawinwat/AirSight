// components/PipelineEye.tsx
import React, { CSSProperties } from 'react';
import BaseEChart from '../charts/base/Echart';
import * as echarts from 'echarts';
import { SeriesOption } from 'echarts';
import { DagRun } from 'src/types/airflow';
import { format, parseISO, roundToNearestMinutes } from 'date-fns';

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
const mapDagRunDataToTimeLabels = (data: DagRun[], timeLabels: string[]): number[] => {
  const counts: Record<string, number> = {};

  // Count occurrences of execution_date rounded to the nearest 5 minutes
  data.forEach((item) => {
    const roundedDate = roundToNearestMinutes(parseISO(item.execution_date), { nearestTo: 5 });
    const timeString = format(roundedDate, 'HH:mm:ss');
    counts[timeString] = (counts[timeString] || 0) + 1;
  });

  // Map the counts to the generated time labels
  return timeLabels.map((label) => counts[label] || 0);
};

interface DagRunEyeProps {
  style?: CSSProperties;
  data: DagRun[];
}

const DagRunEye: React.FC<DagRunEyeProps> = ({ style, data }: DagRunEyeProps) => {
  const timeLabels = generateDailyTimeLabels();
  const dagRunCounts = mapDagRunDataToTimeLabels(data, timeLabels);

  // Define the series option
  const series: SeriesOption[] = [
    {
      type: 'bar',
      data: dagRunCounts,
      coordinateSystem: 'polar',
      label: { show: false },
      itemStyle: {
        color: (params) => {
          const value = (params?.data || 0) as number;

          // Set up color transition based on value range from green to yellow to red
          if (value < 1.33) {
            return `rgb(0, ${Math.floor((value / 1.33) * 255)}, 0)`; // Green
          } else if (value < 2.67) {
            const intensity = Math.floor(((value - 1.33) / 1.34) * 255);
            return `rgb(${intensity}, 255, 0)`; // Yellow
          } else {
            const intensity = Math.floor(((4 - value) / 1.33) * 255);
            return `rgb(255, ${intensity}, 0)`; // Red
          }
        },
      },
    },
  ];

  // Define the chart options
  const option: echarts.EChartsOption = {
    polar: { radius: [30, '80%'] },
    radiusAxis: { max: Math.max(...dagRunCounts, 4) },
    angleAxis: {
      type: 'category',
      data: timeLabels,
      startAngle: 90,
    },
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c}',
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
