const prefix = 'airsight'
const createPath = (path: string) => `/${prefix}${path}`
export const PATH = {
    main: createPath('/main'),
    connectionId: (connectionId: string) => createPath(`/instance/${connectionId}`),
    mainDagId: (connectionId: string, dagId: string) => createPath(`/instance/${connectionId}/${dagId}`),
    config: (connectionId: string) => createPath(`/config${!!connectionId ? `/${connectionId}` : ''}`)
}


