export const PATH = {
    main:'/main',
    connectionId:(connectionId:string)=>`/dags/${connectionId}`,
    mainDagId:(connectionId:string,dagId:string)=>`/dags/${connectionId}/${dagId}`

}