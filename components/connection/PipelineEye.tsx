// components/PipelineEye.tsx
import React from 'react';
import BaseEChart from '../charts/base/Echart';
import * as echarts from 'echarts';
import { SeriesOption } from 'echarts';

const generateRandomData = (numBars: number): number[] => {
  return Array.from({ length: numBars }, () => Math.random() * 4);
};

const generateTimeLabels = (numBars: number): string[] => {
  const labels: string[] = [];
  let hours = 12;
  let minutes = 0;

  for (let i = 0; i < numBars; i++) {
    labels.push(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`);
    minutes += 5;
    if (minutes === 60) {
      minutes = 0;
      hours = (hours + 1) % 12 || 12;
    }
  }

  return labels;
};

const PipelineEye: React.FC = () => {
  const numBars = 120;
  const randomData = generateRandomData(numBars);
  const timeLabels = generateTimeLabels(numBars);

  // Define the series option with explicit typing
  const series: SeriesOption[] = [
    {
      type: 'bar',
      data: randomData,
      coordinateSystem: 'polar',
      label: { show: false },
      itemStyle: {
        // color: (params) => {
        //   const value = (params?.data || 0) as number
        //   const blueIntensity = Math.floor((value / 4) * 255);
        //   return `rgb(${255 - blueIntensity}, ${255 - blueIntensity}, 255)`;
        // },
        color: (params) => {
          const value = (params?.data || 0) as number;
          
          // Set up color transition based on value range from green to yellow to red
          if (value < 1.33) {
            // Green for low values
            return `rgb(0, ${Math.floor((value / 1.33) * 255)}, 0)`;
          } else if (value < 2.67) {
            // Transition through yellow for mid values
            const intensity = Math.floor(((value - 1.33) / 1.34) * 255);
            return `rgb(${intensity}, 255, 0)`;
          } else {
            // Red for high values
            const intensity = Math.floor(((4 - value) / 1.33) * 255);
            return `rgb(255, ${intensity}, 0)`;
          }
        },
      },
    },
  ];

  // Define the option configuration as a regular variable
  const option: echarts.EChartsOption = {
    // title: { text: 'Pipeline Eye - Radial Polar Bar Chart' },
    polar: { radius: [30, '80%'] },
    radiusAxis: { max: 4 },
    angleAxis: {
      type: 'category',
      data: timeLabels,
      startAngle: 90,
    },
    tooltip: {},
    series,  // Pass the typed series array here
    animation: false,
  };

  return (
      <BaseEChart option={option} style={{ height: '180px',width: '250px', }} />
  );
};

export default PipelineEye;
