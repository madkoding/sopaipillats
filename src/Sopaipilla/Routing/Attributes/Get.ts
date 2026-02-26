import 'reflect-metadata';

export interface RouteInfo {
  path: string;
  method: string;
}

const methodRoutes = new WeakMap<Function, RouteInfo>();

export function setRouteOnMethod(methodFn: Function, info: RouteInfo): void {
  methodRoutes.set(methodFn, info);
}

export function getRouteFromMethod(methodFn: Function): RouteInfo | undefined {
  return methodRoutes.get(methodFn);
}

export function Get(path: string): MethodDecorator {
  return (target: any, _propertyKey: string | symbol, descriptor: PropertyDescriptor) => {
    setRouteOnMethod(target, { path, method: 'GET' });
    return descriptor;
  };
}
