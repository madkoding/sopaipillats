import { Model } from '../Sopaipilla/Database/Model.js';
export class UsersModel extends Model {
    static table = 'users';
    static primaryKey = 'id';
    static fillable = ['name', 'email', 'password'];
    static schema = [
        'id INTEGER PRIMARY KEY AUTOINCREMENT',
        'name TEXT NOT NULL',
        'email TEXT NOT NULL UNIQUE',
        'password TEXT NOT NULL',
        'created_at DATETIME DEFAULT CURRENT_TIMESTAMP',
        'updated_at DATETIME DEFAULT CURRENT_TIMESTAMP',
    ];
}
//# sourceMappingURL=UsersModel.js.map