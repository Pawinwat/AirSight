// components/PipelineEye.tsx
import { format, parseISO, roundToNearestMinutes } from 'date-fns';
import * as echarts from 'echarts';
import { DefaultLabelFormatterCallbackParams, SeriesOption } from 'echarts';
import { OptionDataValue } from 'echarts/types/src/util/types.js';
import React, { CSSProperties, useState } from 'react';
import { getStatusColor } from 'src/constant/colors';
import { DagRun, DagState } from 'src/types/airflow';
import BaseEChart from '../charts/base/Echart';
import useInterval from 'src/hooks/useInterval';

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
const mapDagRunDataToTimeLabels = (data: DagRun[], timeLabels: string[]): [Record<string, string | number>[], Record<string, number>] => {
  const counts: Record<string, Record<string, number>> = {};
  const stats: Record<string, number> = {};

  // Count occurrences of execution_date rounded to the nearest 5 minutes
  data.forEach((item) => {
    const roundedDate = roundToNearestMinutes(parseISO(item.execution_date), { nearestTo: 5, roundingMethod: 'floor' });
    const timeString = format(roundedDate, 'HH:mm:ss');
    if (!counts[timeString]) {
      counts[timeString] = {}
    }
    if (!stats[item?.state]) {
      stats[item?.state] = 0
    }
    if (!counts[timeString]?.[item?.state]) {
      counts[timeString][item?.state] = 0
    }
    counts[timeString]['total'] = (counts[timeString]['total'] || 0) + 1;
    counts[timeString][item?.state] = (counts[timeString][item?.state] || 0) + 1;
    stats[item?.state] = (stats[item?.state] || 0) + 1;

  });
  // Map the counts to the generated time labels
  const runs = timeLabels.map((label) => {

    const succesRate = ((counts[label]?.success / counts[label]?.total) * 100)
    const runningRate = ((counts[label]?.running / counts[label]?.total) * 100)

    return {
      time: label,
      ...counts[label],
      succesRate: succesRate,
      failRate: 100 - (succesRate + (runningRate || 0)),
      runningRate
    }
  });
  return [runs, stats]


};

interface DagRunEyeProps {
  style?: CSSProperties;
  data: DagRun[];
  mode?: 'count' | 'state'
}
const valueFormatter = (value: OptionDataValue | any) => {
  return `${value ? value?.toFixed(1) : 0}%`
}
const DagRunEye: React.FC<DagRunEyeProps> = ({ style, data }: DagRunEyeProps) => {
  const timeLabels = generateDailyTimeLabels();
  const [dagRunCounts, dagRunStats] = mapDagRunDataToTimeLabels(data, timeLabels);

  const [now, setNow] = useState<Date>(new Date())

  const [nowSeries, setNowSeries] = useState<string>('#FFF')
  useInterval(() => {
    setNowSeries(prev => prev == '#FFF' ? 'rgba(255,255,255,.5)' : '#FFF')
    setNow(new Date())
  }, 2000)
  const tick = timeLabels?.map(time => ({ time, value: (format(roundToNearestMinutes(now, { nearestTo: 5, roundingMethod: 'floor' }), 'HH:mm:ss') == time) ? 1 : 0 }))
  const series: SeriesOption[] = [
    {
      type: 'bar',
      name: 'Now',
      coordinateSystem: 'polar',
      datasetIndex: 1,
      label: { show: false },
      polarIndex: 2,
      itemStyle: {
        color: nowSeries
      },
      tooltip: {
        show: false
      },
    },
    {
      // type: 'line',
      // areaStyle: {},
      // markPoint:{},
      type:'bar',
      encode: { angle: 'time', radius: 'total' },
      datasetIndex: 0,
      // data: dagRunCounts?.map(rec=>rec?.total || 0),
      coordinateSystem: 'polar',
      label: { show: false },
      name: 'Jobs',
      polarIndex: 0,
      itemStyle: {
        color: (params: DefaultLabelFormatterCallbackParams | any) => {
          const value = (params?.data?.total || 0) as number;
          // Set up color transition based on value range from green to yellow to red
          if (value < 5) {
            return getStatusColor('success'); // Green
          } else if (value < 10) {
            return getStatusColor('upstream_failed'); // Yellow
          } else {
            return getStatusColor('failed'); // Red
          }
        },
      },
    },
    {
      type: 'bar',
      encode: { angle: 'time', radius: 'succesRate' },
      datasetIndex: 0,
      stack: 'status',
      coordinateSystem: 'polar',
      label: { show: false },
      polarIndex: 1,
      name: 'Succes',
      itemStyle: {
        color: (params: DefaultLabelFormatterCallbackParams | any) => {
          const value = (params?.data?.failRate || 0) as number;
          // Set up color transition based on value range from green to yellow to red
          if (value > 0) {
            return getStatusColor('upstream_failed')
          } else {
            return getStatusColor('success')
          }
        },
      },
      tooltip: {
        valueFormatter
      }
    },
    {
      type: 'bar',
      encode: { angle: 'time', radius: 'runningRate' },
      datasetIndex: 0,
      stack: 'status',
      name: 'Running',
      // data: dagRunCounts?.map(rec => (Math.round((rec?.success as number) / (rec?.total as number)) * 100) || null),
      coordinateSystem: 'polar',
      label: { show: false },
      polarIndex: 1,
      itemStyle: {
        color: (_params: any) => getStatusColor('running')
      },
      tooltip: {
        valueFormatter
      }
    },
    {
      type: 'bar',
      encode: { angle: 'time', radius: 'failRate' },
      datasetIndex: 0,
      stack: 'status',
      name: 'Failed',
      // data: dagRunCounts?.map(rec => (Math.round((rec?.success as number) / (rec?.total as number)) * 100) || null),
      coordinateSystem: 'polar',
      label: { show: false },
      polarIndex: 1,
      itemStyle: {
        color: (_params: any) => getStatusColor('failed')
      },
      tooltip: {
        valueFormatter
      }
    },

    {
      name: 'run stats',
      type: 'pie',
      // roseType: 'area',

      selectedMode: 'single',
      radius: ['85%', '90%'],
      label: {
        show: false,
        position: 'inner',
        fontSize: 14
      },
      labelLine: {
        show: false
      },
      data: Object.keys(dagRunStats)?.map(key => ({ value: dagRunStats?.[key], name: key })),
      itemStyle: {
        color: (params) => getStatusColor(params.name as DagState)
      },
      // tooltip: {
      // valueFormatter(value: any, _dataIndex) {
      //   return value?.toFixed(2)
      // },
      // }
    }
  ];

  // Define the chart options
  const option: echarts.EChartsOption = {
    axisPointer: {
      show: 'auto'
    },
    polar: [{ radius: ['20%', '50%'] }, { radius: ['65%', '80%'] }, { radius: ['20%', '65%'] }],
    radiusAxis: [{ polarIndex: 0 }, { polarIndex: 1 }, { polarIndex: 2, show: false }],
    dataset: [
      {
        dimensions: ['time', 'total', 'success', 'failed', 'running', 'succesRate', 'failRate', 'runningRate'],
        source: dagRunCounts,
      },
      {
        dimensions: ['time', 'value'],
        source: tick
      }
    ],
    grid: {
      top: 0,
      bottom: 0,
      left: 0,
      right: 0
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
      },
      {
        polarIndex: 2,
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
