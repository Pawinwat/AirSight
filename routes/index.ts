export const PATH = {
    main:'/main',
    dagsId:(connectionId:string)=>`/dags/${connectionId}`,
    mainDagId:(connectionId:string,dagId:string)=>`/dags/${connectionId}/${dagId}`

}