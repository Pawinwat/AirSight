import { Tag } from 'primereact/tag'
import { getStatusColor } from 'src/constant/colors'
import { DagState } from 'src/types/airflow'

interface DagRunStatProps {
    data: Record<string, number | undefined>
}
function DagRunStat({ data }: DagRunStatProps) {
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'row',
                gap: '10px'
            }}
        >
            {
                Object.keys(data)?.map(key => (
                    <Tag 
                    key={key}
                    severity="success" 
                    value={data[key]}
                    style={{
                        backgroundColor: getStatusColor(key as DagState)
                    }}
                    ></Tag>

                
                ))
            }
        </div>
    )
}

export default DagRunStat