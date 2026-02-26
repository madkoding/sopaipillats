import 'reflect-metadata';

export interface RouteConfig {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  middlewares?: ((req: any, res: any, next: any) => void)[];
}

export const ROUTE_METADATA_KEY = 'sopaipilla:route';

export function setRouteMetadata(
  target: any,
  propertyKey: string,
  config: RouteConfig
) {
  Reflect.defineMetadata(ROUTE_METADATA_KEY, config, target, propertyKey);
}

export function getRouteMetadata(
  target: any,
  propertyKey: string
): RouteConfig | undefined {
  return Reflect.getMetadata(ROUTE_METADATA_KEY, target, propertyKey);
}
