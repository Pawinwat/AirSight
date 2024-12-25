import { Button, ButtonProps } from 'primereact/button'
import React, { useEffect } from 'react'
import { useTriggerDag } from 'src/api/local/airflow/hooks'
import { useDagRunsContext } from 'src/contexts/useDagsRuns'
interface RunDagButton extends ButtonProps {
    dagId: string
}
function RunDagButton(props: RunDagButton) {
    const {dagId, ...buttonProps} = props;

    const { connection, dagRuns } = useDagRunsContext()
    const trigger = useTriggerDag(
        { params: {} },
        connection?.connection_id as string,
        dagId
    )
    const onClick = () => {
        trigger.mutate()
    }
    useEffect(() => {
        if (trigger?.isSuccess) {
            dagRuns.refetch()
        }
    }, [trigger?.isSuccess])


    return (
        <Button icon="pi pi-play" {...buttonProps} onClick={onClick} disabled={buttonProps.disabled || trigger?.isPending} />
    )
}

export default RunDagButton