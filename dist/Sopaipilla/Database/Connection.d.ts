import { Knex } from 'knex';
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
export declare function loadDatabaseConfig(appConfig: AppDatabaseConfig): void;
export declare function getConnection(name?: string): Knex;
export declare function closeConnections(): void;
//# sourceMappingURL=Connection.d.ts.map