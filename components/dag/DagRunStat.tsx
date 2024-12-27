import { Button } from 'primereact/button'
import React from 'react'
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
                    <Button
                        outlined
                        size='small'
                        style={{
                            color: getStatusColor(key as DagState)
                        }}
                    >
                        {
                            data[key]
                        }
                    </Button>
                ))
            }
        </div>
    )
}

export default DagRunStat