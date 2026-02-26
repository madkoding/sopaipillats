import { Request, Response } from 'express';
import { ClassConstructor } from 'class-transformer';
export declare abstract class ApiController {
    protected static allowedOrigin: string;
    constructor();
    private sendSecurityHeaders;
    protected setSecurityHeaders(_req: Request, res: Response): void;
    protected json(data: any, _status?: number): {
        success: boolean;
        data?: any;
    };
    protected error(message: string, _status?: number): {
        success: false;
        error: string;
    };
    protected okOr201<T>(data: T | null, message?: string): any;
    protected okOr404<T>(data: T | null, message?: string): any;
    protected validationError(errors: Record<string, string[]>): any;
    protected input(req: Request): any;
    protected withDto<T extends object>(_dtoClass: ClassConstructor<T>, req: Request, callback: (dto: T) => any): Promise<any>;
    protected sendResponse(res: Response, payload: any, status?: number): void;
}
//# sourceMappingURL=ApiController.d.ts.map