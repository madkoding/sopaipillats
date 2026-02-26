import { setRouteMetadata } from './RouteConfig.js';
export function Put(path) {
    return (target, propertyKey, descriptor) => {
        const config = { path, method: 'PUT' };
        setRouteMetadata(target, propertyKey, config);
        return descriptor;
    };
}
//# sourceMappingURL=Put.js.map