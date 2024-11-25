import { useRouter } from 'next/router'
import prisma from 'src/lib/prisma';

export async function getServerSideProps() {
    const connections = await prisma.connection.findMany({
      where: {
        is_active: true,
      },
      select: {
        connection_id: true,
        name: true,
        ui_url: true,
        header:true
      },
    });
    
    return {
      props: {
        connections,
      },
    };
  }
 
export default function Page() {
  const router = useRouter()
  return <p>Dashboard: {router.query.connectionId}</p>
}