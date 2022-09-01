import { dependencyContainer, Type } from "./Container";


// rename injectDependency to dependency
// rename dependency to provides


/**
 * A class decorator that registers the class as a dependency.
 * @param key The key/symbol of the dependency to register
 */
export function provides<T>(key:symbol) {
    return (ctor: Type<T>) => {
        dependencyContainer.register<T>(key, ctor);
    }
};


/**
 * A class property decorator that retrieves the dependency from the container.
 * @param key They key/symbol of the dependency to retrieve
 */
export function inject<T>(key: symbol) {
    return (target: Object, propertyKey: string) => {
        // @ts-ignore 7035 cannot index with string
        target[propertyKey] = dependencyContainer.get<T>(key);
    };
}