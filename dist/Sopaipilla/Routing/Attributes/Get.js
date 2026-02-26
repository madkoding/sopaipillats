import 'reflect-metadata';
const methodRoutes = new WeakMap();
export function setRouteOnMethod(methodFn, info) {
    methodRoutes.set(methodFn, info);
}
export function getRouteFromMethod(methodFn) {
    return methodRoutes.get(methodFn);
}
export function Get(path) {
    return (target, _propertyKey, descriptor) => {
        setRouteOnMethod(target, { path, method: 'GET' });
        return descriptor;
    };
}
//# sourceMappingURL=Get.js.map