import sql, { ConnectionPool } from "mssql";

const pools = new Map();

/**
 * Get or create a pool. If a pool doesn't exist the config must be provided.
 * If the pool does exist the config is ignored (even if it was different to the one provided
 * when creating the pool)
 *
 * @param {string} name
 * @param {{}} [config]
 * @return {Promise.<mssql.ConnectionPool>}
 */
export async function get(
  name: string,
  config: string | null,
): Promise<ConnectionPool> {
  if (!pools.has(name)) {
    if (!config) {
      throw new Error("Pool does not exist");
    }
    const pool: sql.ConnectionPool = await new sql.ConnectionPool(config);
    // automatically remove the pool from the cache if `pool.close()` is called
    //const close = pool.close.bind(pool);
    /*pool.close = (...args) => {
    pools.delete(name);
    return close(...args);
   }*/
    try {
      pools.set(name, pool.connect());
    } catch (error) {
      throw Error((error as Error).message);
    }
  }
  return pools.get(name);
}
/**
   * Closes all the pools and removes them from the store
   *
   * @return {Promise<mssql.ConnectionPool[]>}
   
  closeAll: () =>
    Promise.all(
      Array.from(pools.values()).map((connect) => {
        return connect.then((pool: ConnectionPool) => pool.close());
      }),
    ),
};*/
