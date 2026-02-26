import { setRouteMetadata, RouteConfig } from './RouteConfig.js';

export function Delete(path: string): MethodDecorator {
  return (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) => {
    const config: RouteConfig = { path, method: 'DELETE' };
    setRouteMetadata(target, propertyKey as string, config);
    return descriptor;
  };
}
