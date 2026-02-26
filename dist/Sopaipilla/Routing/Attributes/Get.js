import { setRouteMetadata } from './RouteConfig.js';
export function Get(path) {
    return (target, propertyKey, descriptor) => {
        const config = { path, method: 'GET' };
        setRouteMetadata(target, propertyKey, config);
        return descriptor;
    };
}
//# sourceMappingURL=Get.js.map