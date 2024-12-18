import { Button, ButtonProps } from 'primereact/button'
import React from 'react'
interface RunDagButton extends ButtonProps {
    dagId:string
}
function RunDagButton(props:RunDagButton) {
    
  return (
    <Button icon="pi pi-play" {...props} />
  )
}

export default RunDagButton