import prisma from "src/lib/prisma";

export const getConnectionById = async (connectionId: string) => {
    const connections = await prisma.connection.findFirst({
        where: {
            connection_id: connectionId,
            is_active: true,
        },
    });
    return connections
}