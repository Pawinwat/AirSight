import { Button, ButtonProps } from 'primereact/button'
import React, { useEffect } from 'react'
import { useTriggerDag } from 'src/api/local/airflow/hooks'
import { useDagRunsContext } from 'src/contexts/useDagsRuns'
interface RunDagButton extends ButtonProps {
    dagId: string
}
function RunDagButton(props: RunDagButton) {
    const { connection, dagRuns } = useDagRunsContext()
    const trigger = useTriggerDag(
        { params: {} },
        connection?.connection_id as string,
        props.dagId
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
        <Button icon="pi pi-play" {...props} onClick={onClick} disabled={props.disabled || trigger?.isPending} />
    )
}

export default RunDagButton