import 'reflect-metadata';
import { setRouteOnMethod } from './Get.js';
export function Put(path) {
    return (target, _propertyKey, descriptor) => {
        setRouteOnMethod(target, { path, method: 'PUT' });
        return descriptor;
    };
}
//# sourceMappingURL=Put.js.map