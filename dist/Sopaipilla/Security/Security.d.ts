import { Request, Response, NextFunction } from 'express';
export declare class Security {
    static cleanAll(req: Request, res: Response, next: NextFunction): void;
    static sanitize(value: any): any;
    static securityHeaders(_req: Request, res: Response, next: NextFunction): void;
    static cors(allowedOrigin?: string): (req: Request, res: Response, next: NextFunction) => void;
}
//# sourceMappingURL=Security.d.ts.map