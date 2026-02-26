import 'reflect-metadata';
import { setRouteOnMethod } from './Get.js';

export function Post(path: string): MethodDecorator {
  return (target: any, _propertyKey: string | symbol, descriptor: PropertyDescriptor) => {
    setRouteOnMethod(target, { path, method: 'POST' });
    return descriptor;
  };
}
