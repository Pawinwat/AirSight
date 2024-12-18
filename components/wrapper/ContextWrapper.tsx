import { ReactNode } from 'react';
import { useDagRunsContext } from 'src/contexts/useDagsRuns';


interface ContextWrapperProps {
    // connection: ConnectionData;
    children: ReactNode
}

// export const getServerSideProps: GetServerSideProps = async ({ params, query }) => {
//     const { connectionId } = params as { connectionId: string };
//     const connection = await prisma.connection.findFirst({
//         where: {
//             connection_id: connectionId,
//             is_active: true,
//         },
//     });

//     if (!connection || !connection.api_url || !connection.header) {
//         return { notFound: true };
//     }


//     // console.log(data)
//     return {
//         props: {
//             connection,
//         },
//     };
// };

function ContextWrapper({ children }: ContextWrapperProps) {
    const {  } = useDagRunsContext()
    // useEffect(() => {
    //     setConnection(connection)
    // }, [connection?.connection_id])

    return (
        <>{children}</>
    )
}

export default ContextWrapper