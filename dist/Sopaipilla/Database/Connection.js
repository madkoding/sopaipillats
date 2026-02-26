import knex from 'knex';
let config = null;
const connections = new Map();
export function loadDatabaseConfig(appConfig) {
    config = appConfig;
}
export function getConnection(name) {
    const connectionName = name || config?.default || 'sqlite';
    if (connections.has(connectionName)) {
        return connections.get(connectionName);
    }
    if (!config || !config.connections[connectionName]) {
        throw new Error(`Connection '${connectionName}' not defined in database config`);
    }
    const dbConfig = config.connections[connectionName];
    const knexInstance = knex({
        client: dbConfig.client,
        connection: dbConfig.connection,
        pool: dbConfig.pool,
        useNullAsDefault: dbConfig.useNullAsDefault ?? true,
    });
    connections.set(connectionName, knexInstance);
    return knexInstance;
}
export function closeConnections() {
    for (const conn of connections.values()) {
        conn.destroy();
    }
    connections.clear();
}
//# sourceMappingURL=Connection.js.map