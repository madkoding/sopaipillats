import { Request } from 'express';
import { ApiController } from '../../Sopaipilla/Http/ApiController.js';
export declare class UsersController extends ApiController {
    constructor();
    index(): Promise<any>;
    show(req: Request): Promise<any>;
    store(req: Request): Promise<any>;
    update(req: Request): Promise<any>;
    destroy(req: Request): Promise<any>;
}
//# sourceMappingURL=UsersController.d.ts.map