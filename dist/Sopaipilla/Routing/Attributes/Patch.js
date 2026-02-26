import { setRouteMetadata } from './RouteConfig.js';
export function Patch(path) {
    return (target, propertyKey, descriptor) => {
        const config = { path, method: 'PATCH' };
        setRouteMetadata(target, propertyKey, config);
        return descriptor;
    };
}
//# sourceMappingURL=Patch.js.map