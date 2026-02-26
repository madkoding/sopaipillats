import { setRouteMetadata } from './RouteConfig.js';
export function Post(path) {
    return (target, propertyKey, descriptor) => {
        const config = { path, method: 'POST' };
        setRouteMetadata(target, propertyKey, config);
        return descriptor;
    };
}
//# sourceMappingURL=Post.js.map