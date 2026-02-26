import 'reflect-metadata';
import { setRouteOnMethod } from './Get.js';
export function Delete(path) {
    return (target, _propertyKey, descriptor) => {
        setRouteOnMethod(target, { path, method: 'DELETE' });
        return descriptor;
    };
}
//# sourceMappingURL=Delete.js.map