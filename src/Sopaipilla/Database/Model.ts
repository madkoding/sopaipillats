import { Knex } from 'knex';
import { getConnection } from './Connection.js';

export interface ModelSchema {
  table: string;
  primaryKey?: string;
  connection?: string;
  fillable?: string[];
  schema?: string[];
}

export abstract class Model {
  protected static table: string = '';
  protected static primaryKey: string = 'id';
  protected static connection: string = '';
  protected static fillable: string[] = [];
  protected static schema: string[] = [];

  protected static get tableName(): string {
    if (this.table) {
      return this.table;
    }
    const className = this.constructor.name;
    return className.replace(/Model$/, '').toLowerCase() + 's';
  }

  protected static get connectionName(): string {
    return this.connection || '';
  }

  protected static knex(): Knex {
    return getConnection(this.connectionName);
  }

  protected static filterFillable(data: Record<string, any>): Record<string, any> {
    if (this.fillable.length === 0) {
      return data;
    }
    const filtered: Record<string, any> = {};
    for (const key of this.fillable) {
      if (key in data) {
        filtered[key] = data[key];
      }
    }
    return filtered;
  }

  public static async migrate(): Promise<void> {
    if (this.schema.length === 0) {
      return;
    }

    const hasTable = await this.knex().schema.hasTable(this.tableName);
    if (!hasTable) {
      const columns = this.schema.join(', ');
      await this.knex().raw(`CREATE TABLE ${this.tableName} (${columns})`);
    }
  }

  public static async all(): Promise<any[]> {
    return this.knex()(this.tableName).select('*');
  }

  public static async find(id: number | string): Promise<any | null> {
    const row = await this.knex()(this.tableName)
      .where(this.primaryKey, id)
      .first();
    return row || null;
  }

  public static async create(data: Record<string, any>): Promise<any> {
    const filtered = this.filterFillable(data);
    const [id] = await this.knex()(this.tableName).insert(filtered);
    return this.find(id);
  }

  public static async update(id: number | string, data: Record<string, any>): Promise<any | null> {
    const filtered = this.filterFillable(data);
    
    if (Object.keys(filtered).length === 0) {
      return this.find(id);
    }

    const updated = await this.knex()(this.tableName)
      .where(this.primaryKey, id)
      .update(filtered);

    return updated > 0 ? this.find(id) : null;
  }

  public static async delete(id: number | string): Promise<boolean> {
    const deleted = await this.knex()(this.tableName)
      .where(this.primaryKey, id)
      .del();
    return deleted > 0;
  }

  public static async where(
    column: string,
    value: any,
    single: boolean = false
  ): Promise<any[] | any | null> {
    const query = this.knex()(this.tableName).where(column, value);
    
    if (single) {
      return query.first();
    }
    
    return query;
  }
}
