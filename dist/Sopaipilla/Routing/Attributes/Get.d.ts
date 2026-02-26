import 'reflect-metadata';
export interface RouteInfo {
    path: string;
    method: string;
}
export declare function setRouteOnMethod(methodFn: Function, info: RouteInfo): void;
export declare function getRouteFromMethod(methodFn: Function): RouteInfo | undefined;
export declare function Get(path: string): MethodDecorator;
//# sourceMappingURL=Get.d.ts.map