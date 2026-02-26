import { setRouteMetadata } from './RouteConfig.js';
export function Delete(path) {
    return (target, propertyKey, descriptor) => {
        const config = { path, method: 'DELETE' };
        setRouteMetadata(target, propertyKey, config);
        return descriptor;
    };
}
//# sourceMappingURL=Delete.js.map