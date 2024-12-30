import { InputJsonValue } from "@prisma/client/runtime/library";
import prisma from "src/lib/prisma";
import { ConnectionData } from "src/types/db";

export const getConnectionList = async () => {
    const connections = await prisma.connection.findMany({
        where: {
            is_active: true,
        },
    });
    return connections
}

export const getConnectionById = async (connectionId: string) => {
    const connections = await prisma.connection.findFirst({
        where: {
            connection_id: connectionId,
            is_active: true,
        },
    });
    return connections
}

export const updateConnectionById = async (connectionId: string, payload: ConnectionData) => {
    const connections = await prisma.connection.update({
        where: {
            connection_id: connectionId,
            is_active: true,
        },
        data: {
            ...payload,
            header: payload.header as InputJsonValue
        }
    });
    return connections
}

export const createConnection = async (payload: ConnectionData) => {
    delete payload.connection_id;
    const connections = await prisma.connection.create({
        data: {
            ...payload,
            header: payload.header as InputJsonValue
        }
    });
    return connections
}

export const deleteConnection = async (connectionId: string) => {
    await prisma.connection.update({
        where: {
            connection_id: connectionId,
            is_active: true,
        },
        data: {
            is_active: false
        }
    });
    return { message: 'Connection deleted' }
}
