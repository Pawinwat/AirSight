import { EChartsOption } from 'echarts';
import EChartComponent from './base/Echart';
import { DagState } from 'src/types/airflow';
import { getStatusColor } from 'src/constant/colors';
interface RunHistoryProps {
    data: {
        executionDate: Date;
        runTime: number;
        statusColor: string;
        state: DagState;
    }[]
}
function RunHistory({ data }: RunHistoryProps) {
    const dimensions = ['executionDate', 'runTime', 'statusColor']
    const option: EChartsOption = {
        dataset: [
            {
                id: 'all',
                dimensions,
                source: data,
            },
        ],
        title: {
        },
        tooltip: {
            trigger: 'item',
            formatter: (params: any) => {
                const executionDate = new Date(params.data.executionDate).toLocaleString();
                const runTime = params.data.runTime;
                return `Execution Date: ${executionDate}<br>Run Time: ${runTime}s`;
            },
        },
        xAxis: {
            type: 'time',
            name: 'Execution Date',
            axisLabel: {
                formatter: (value) => new Date(value).toLocaleDateString(),
            },
        },
        yAxis: {
            type: 'value',
            name: 'Run Time (seconds)',
        },
        series: [
            {
                datasetId: 'all',
                name: 'Run Time vs Execution Date',
                type: 'scatter',
                encode: { x: 'executionDate', y: 'runTime' },
                // symbolSize: 10,
                itemStyle: {
                    color: (params: any) => params.data.statusColor, // Use the statusColor field for dynamic coloring
                },
            },
            {
                datasetId: 'all',
                type: 'line',
                step: 'middle',
                encode: { x: 'executionDate', y: 'runTime' },
                symbolSize: 0,
                silent: true,
                itemStyle: {
                    color: getStatusColor('queued'),
                },
                markLine: {
                    data: [
                        // { type: 'average', name: 'Avg' },
                        // { type: 'max', name: 'Max' },
                        // { type: 'min', name: 'Min' },
                        {
                            type: 'median',
                            name: 'Median',
                            symbolSize: 0,

                            itemStyle: {
                                color: getStatusColor('upstream_failed'),
                            }
                        }
                    ]
                }
            },

        ],
    };

    return <EChartComponent option={option} />;
}

export default RunHistory;
