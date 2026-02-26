import { setRouteMetadata, RouteConfig } from './RouteConfig.js';

export function Patch(path: string): MethodDecorator {
  return (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) => {
    const config: RouteConfig = { path, method: 'PATCH' };
    setRouteMetadata(target, propertyKey as string, config);
    return descriptor;
  };
}
