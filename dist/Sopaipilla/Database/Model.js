import { getConnection } from './Connection.js';
export class Model {
    static table = '';
    static primaryKey = 'id';
    static connection = '';
    static fillable = [];
    static schema = [];
    static get tableName() {
        if (this.table) {
            return this.table;
        }
        const className = this.constructor.name;
        return className.replace(/Model$/, '').toLowerCase() + 's';
    }
    static get connectionName() {
        return this.connection || '';
    }
    static knex() {
        return getConnection(this.connectionName);
    }
    static filterFillable(data) {
        if (this.fillable.length === 0) {
            return data;
        }
        const filtered = {};
        for (const key of this.fillable) {
            if (key in data) {
                filtered[key] = data[key];
            }
        }
        return filtered;
    }
    static async migrate() {
        if (this.schema.length === 0) {
            return;
        }
        const hasTable = await this.knex().schema.hasTable(this.tableName);
        if (!hasTable) {
            const columns = this.schema.join(', ');
            await this.knex().raw(`CREATE TABLE ${this.tableName} (${columns})`);
        }
    }
    static async all() {
        return this.knex()(this.tableName).select('*');
    }
    static async find(id) {
        const row = await this.knex()(this.tableName)
            .where(this.primaryKey, id)
            .first();
        return row || null;
    }
    static async create(data) {
        const filtered = this.filterFillable(data);
        const [id] = await this.knex()(this.tableName).insert(filtered);
        return this.find(id);
    }
    static async update(id, data) {
        const filtered = this.filterFillable(data);
        if (Object.keys(filtered).length === 0) {
            return this.find(id);
        }
        const updated = await this.knex()(this.tableName)
            .where(this.primaryKey, id)
            .update(filtered);
        return updated > 0 ? this.find(id) : null;
    }
    static async delete(id) {
        const deleted = await this.knex()(this.tableName)
            .where(this.primaryKey, id)
            .del();
        return deleted > 0;
    }
    static async where(column, value, single = false) {
        const query = this.knex()(this.tableName).where(column, value);
        if (single) {
            return query.first();
        }
        return query;
    }
}
//# sourceMappingURL=Model.js.map