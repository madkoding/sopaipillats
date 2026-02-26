import { Request, Response } from 'express';
export declare class Session {
    private req;
    private res;
    private sessionId;
    private data;
    private dirty;
    constructor(req: Request, res: Response);
    private init;
    private parseCookies;
    private setCookie;
    get(key: string): any;
    set(key: string, value: any): void;
    has(key: string): boolean;
    delete(key: string): void;
    destroy(): void;
    save(): void;
    regenerate(): void;
    getAll(): Record<string, any>;
    static cleanup(): void;
}
//# sourceMappingURL=Session.d.ts.map