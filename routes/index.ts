export const PATH = {
    main:'/main',
    connectionId:(connectionId:string)=>`/instance/${connectionId}`,
    mainDagId:(connectionId:string,dagId:string)=>`/instance/${connectionId}/${dagId}`,
    config:(connectionId:string)=>`/config${!!connectionId ? `/${connectionId}` : ''}`
}