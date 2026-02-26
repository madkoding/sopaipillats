import 'reflect-metadata';
import { setRouteOnMethod } from './Get.js';
export function Post(path) {
    return (target, _propertyKey, descriptor) => {
        setRouteOnMethod(target, { path, method: 'POST' });
        return descriptor;
    };
}
//# sourceMappingURL=Post.js.map