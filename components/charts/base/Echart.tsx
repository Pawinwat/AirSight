import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

interface EChartComponentProps {
  option: echarts.EChartsOption;
  style?: React.CSSProperties;
  onInit?:(_:echarts.ECharts)=>void
}

const EChartComponent: React.FC<EChartComponentProps> = ({ option, style,onInit }) => {
  const chartRef = useRef<HTMLDivElement | null>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (chartRef.current) {
      // Initialize ECharts instance
      chartInstance.current = echarts.init(chartRef.current);

      // Set initial option
      chartInstance.current.setOption(option);
      if(!!onInit){
        onInit(chartInstance.current)
      }
    }

    return () => {
      // Dispose ECharts instance on unmount
      chartInstance.current?.dispose();
    };
  }, []);

  useEffect(() => {
    // Update chart when `option` changes
    if (chartInstance.current) {
      chartInstance.current.setOption(option);
    }
  }, [JSON.stringify(option)]);

  return (
    <div
      ref={chartRef}
      style={{
        height: '400px',
        width: '100%',
        ...style,
      }}
    />
  );
};

export default EChartComponent;
