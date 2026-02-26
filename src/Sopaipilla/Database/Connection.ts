import knex, { Knex } from 'knex';

export interface DatabaseConfig {
  client: 'pg' | 'mysql2' | 'better-sqlite3' | 'sqlite3';
  connection: string | object;
  pool?: {
    min?: number;
    max?: number;
  };
  useNullAsDefault?: boolean;
}

export interface AppDatabaseConfig {
  default: string;
  connections: Record<string, DatabaseConfig>;
}

let config: AppDatabaseConfig | null = null;
const connections: Map<string, Knex> = new Map();

export function loadDatabaseConfig(appConfig: AppDatabaseConfig): void {
  config = appConfig;
}

export function getConnection(name?: string): Knex {
  const connectionName = name || config?.default || 'sqlite';
  
  if (connections.has(connectionName)) {
    return connections.get(connectionName)!;
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

export function closeConnections(): void {
  for (const conn of connections.values()) {
    conn.destroy();
  }
  connections.clear();
}
