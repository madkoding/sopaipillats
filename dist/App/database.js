import { Env } from '../../Sopaipilla/Env.js';
import { loadDatabaseConfig } from '../../Sopaipilla/Database/Connection.js';
export const databaseConfig = {
    default: Env.get('DB_CONNECTION', 'sqlite') || 'sqlite',
    connections: {
        sqlite: {
            client: 'sqlite3',
            connection: {
                filename: Env.get('DB_DATABASE', ':memory:') || ':memory:',
            },
            useNullAsDefault: true,
        },
        mysql: {
            client: 'mysql2',
            connection: {
                host: Env.get('DB_HOST', '127.0.0.1'),
                port: Env.getInt('DB_PORT', 3306),
                user: Env.get('DB_USERNAME', 'root'),
                password: Env.get('DB_PASSWORD', ''),
                database: Env.get('DB_NAME', 'sopaipilla'),
            },
        },
        pgsql: {
            client: 'pg',
            connection: {
                host: Env.get('DB_HOST', '127.0.0.1'),
                port: Env.getInt('DB_PORT', 5432),
                user: Env.get('DB_USERNAME', 'postgres'),
                password: Env.get('DB_PASSWORD', ''),
                database: Env.get('DB_NAME', 'sopaipilla'),
            },
        },
    },
};
loadDatabaseConfig(databaseConfig);
//# sourceMappingURL=database.js.map