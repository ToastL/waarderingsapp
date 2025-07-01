import { Pool, PoolConfig } from "pg"

const cachedPools: { [key: string]: Pool } = {}

const user = process.env.DATABASE_USER
const host = process.env.DATABASE_HOST
const database = process.env.DATABASE

export async function createConnectionPool(
    cacheKey: string,
    config?: Partial<PoolConfig>
): Promise<Pool> {
    if (cachedPools[cacheKey]) {
        return cachedPools[cacheKey]
    }

    const connectionConfig: PoolConfig = {
        user,
        host,
        database,
        ...config
    }

    try {
        const pool = new Pool(connectionConfig)

        cachedPools[cacheKey] = pool
        return pool
    } catch (error) {
        console.log(error)
        throw error
    }
}