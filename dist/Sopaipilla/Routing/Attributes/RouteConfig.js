import 'reflect-metadata';
export const ROUTE_METADATA_KEY = 'sopaipilla:route';
export function setRouteMetadata(target, propertyKey, config) {
    Reflect.defineMetadata(ROUTE_METADATA_KEY, config, target, propertyKey);
}
export function getRouteMetadata(target, propertyKey) {
    return Reflect.getMetadata(ROUTE_METADATA_KEY, target, propertyKey);
}
//# sourceMappingURL=RouteConfig.js.map