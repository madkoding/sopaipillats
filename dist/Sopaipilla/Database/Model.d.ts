import { Knex } from 'knex';
export interface ModelSchema {
    table: string;
    primaryKey?: string;
    connection?: string;
    fillable?: string[];
    schema?: string[];
}
export declare abstract class Model {
    protected static table: string;
    protected static primaryKey: string;
    protected static connection: string;
    protected static fillable: string[];
    protected static schema: string[];
    protected static get tableName(): string;
    protected static get connectionName(): string;
    protected static knex(): Knex;
    protected static filterFillable(data: Record<string, any>): Record<string, any>;
    static migrate(): Promise<void>;
    static all(): Promise<any[]>;
    static find(id: number | string): Promise<any | null>;
    static create(data: Record<string, any>): Promise<any>;
    static update(id: number | string, data: Record<string, any>): Promise<any | null>;
    static delete(id: number | string): Promise<boolean>;
    static where(column: string, value: any, single?: boolean): Promise<any[] | any | null>;
}
//# sourceMappingURL=Model.d.ts.map