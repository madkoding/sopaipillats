import 'reflect-metadata';
export interface RouteConfig {
    path: string;
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    middlewares?: ((req: any, res: any, next: any) => void)[];
}
export declare const ROUTE_METADATA_KEY = "sopaipilla:route";
export declare function setRouteMetadata(target: any, propertyKey: string, config: RouteConfig): void;
export declare function getRouteMetadata(target: any, propertyKey: string): RouteConfig | undefined;
//# sourceMappingURL=RouteConfig.d.ts.map