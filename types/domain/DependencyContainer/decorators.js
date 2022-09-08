import { dependencyContainer } from "./Container";
// rename injectDependency to dependency
// rename dependency to provides
/**
 * A class decorator that registers the class as a dependency.
 * @param key The key/symbol of the dependency to register
 * @param predicate if false, the dependency does not get registered.
 */
export function provides(key, predicate) {
    return (ctor) => {
        dependencyContainer.register(key, ctor, predicate);
    };
}
;
/**
 * A class property decorator that retrieves the dependency from the container.
 * @param key They key/symbol of the dependency to retrieve
 */
export function inject(key) {
    return (target, propertyKey) => {
        Object.defineProperty(target, propertyKey, {
            get: () => dependencyContainer.get(key)
        });
    };
}
