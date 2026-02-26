import { setRouteMetadata, RouteConfig } from './RouteConfig.js';

export function Get(path: string): MethodDecorator {
  return (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) => {
    const config: RouteConfig = { path, method: 'GET' };
    setRouteMetadata(target, propertyKey as string, config);
    return descriptor;
  };
}
