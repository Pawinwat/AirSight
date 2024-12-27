import { Card } from 'primereact/card'
import { INSTANCE_COLORS } from 'src/constant/colors'
import { InstanceStatus } from 'src/types/airflow'
import { CARD_GAP } from '../layout/constants'

interface StatusCardProps {
    data: InstanceStatus
}
function StatusCard({ data }: StatusCardProps) {
    return (
        <div
            className='p-formframe'
        >
            {
                Object.keys(data || {})
                    .map(k => <Card
                    key={k}
                    >
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                gap: CARD_GAP,
                                justifyItems: 'center',
                                alignItems: 'center'
                            }}
                        >
                            <i className='pi pi-circle-fill' style={{ fontSize: '1rem', marginRight: '0.5rem', color: INSTANCE_COLORS[data[k]?.status] }} ></i>
                            <p>
                                {k}
                            </p>
                            {
                                data?.[k]?.[`latest_${k}_heartbeat`]
                            }
                        </div>

                    </Card>)
            }
        </div>
    )
}

export default StatusCard