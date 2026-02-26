var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ApiController } from '../../Sopaipilla/Http/ApiController.js';
import { Get, Post, Put, Delete } from '../../Sopaipilla/Routing/Attributes/index.js';
import { UsersModel } from './UsersModel.js';
import { CreateUserDTO } from './DTO/CreateUserDTO.js';
import { UpdateUserDTO } from './DTO/UpdateUserDTO.js';
import { Crypt } from '../../Sopaipilla/Security/Crypt.js';
export class UsersController extends ApiController {
    constructor() {
        super();
        UsersModel.migrate();
    }
    async index() {
        const data = await UsersModel.all();
        return this.json({ data, meta: { total: data.length } });
    }
    async show(req) {
        const id = parseInt(req.params.id, 10);
        const user = await UsersModel.find(id);
        return this.okOr404(user, 'User not found');
    }
    async store(req) {
        return this.withDto(CreateUserDTO, req, async (dto) => {
            const hashedPassword = Crypt.hashBcrypt(dto.password);
            const user = await UsersModel.create({
                name: dto.name,
                email: dto.email,
                password: hashedPassword,
            });
            delete user.password;
            return this.okOr201(user);
        });
    }
    async update(req) {
        const id = parseInt(req.params.id, 10);
        const existing = await UsersModel.find(id);
        if (!existing) {
            return this.error('User not found', 404);
        }
        return this.withDto(UpdateUserDTO, req, async (dto) => {
            const data = {};
            if (dto.name)
                data.name = dto.name;
            if (dto.email)
                data.email = dto.email;
            const user = await UsersModel.update(id, data);
            return this.okOr404(user, 'User not found');
        });
    }
    async destroy(req) {
        const id = parseInt(req.params.id, 10);
        const deleted = await UsersModel.delete(id);
        return deleted
            ? { success: true, data: { deleted: true }, status: 200 }
            : this.error('User not found', 404);
    }
}
__decorate([
    Get('/api/users'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "index", null);
__decorate([
    Get('/api/users/:id'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "show", null);
__decorate([
    Post('/api/users'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "store", null);
__decorate([
    Put('/api/users/:id'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "update", null);
__decorate([
    Delete('/api/users/:id'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "destroy", null);
//# sourceMappingURL=UsersController.js.map