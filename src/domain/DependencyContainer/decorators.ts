import { dependencyContainer, Type } from "./Container";


// rename injectDependency to dependency
// rename dependency to provides


/**
 * A class decorator that registers the class as a dependency.
 * @param key The key/symbol of the dependency to register
 * @param predicate if false, the dependency does not get registered.
 */
export function provides<T>(key:symbol, predicate?: boolean) {
    return (ctor: Type<T>) => {
        dependencyContainer.register<T>(key, ctor, predicate);
    }
};


/**
 * A class property decorator that retrieves the dependency from the container.
 * @param key They key/symbol of the dependency to retrieve
 */
export function inject<T>(key: symbol) {
    return (target: Object, propertyKey: string) => {
        Object.defineProperty(target, propertyKey, {
            get: () => dependencyContainer.get<T>(key)
        });
    };
}