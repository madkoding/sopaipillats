import 'reflect-metadata';
import { setRouteOnMethod } from './Get.js';
export function Patch(path) {
    return (target, _propertyKey, descriptor) => {
        setRouteOnMethod(target, { path, method: 'PATCH' });
        return descriptor;
    };
}
//# sourceMappingURL=Patch.js.map