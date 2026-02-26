import 'reflect-metadata';
import { setRouteOnMethod } from './Get.js';

export function Delete(path: string): MethodDecorator {
  return (target: any, _propertyKey: string | symbol, descriptor: PropertyDescriptor) => {
    setRouteOnMethod(target, { path, method: 'DELETE' });
    return descriptor;
  };
}
