import { setRouteMetadata, RouteConfig } from './RouteConfig.js';

export function Put(path: string): MethodDecorator {
  return (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) => {
    const config: RouteConfig = { path, method: 'PUT' };
    setRouteMetadata(target, propertyKey as string, config);
    return descriptor;
  };
}
