// todo: ts issues with symbol index

export interface Type<T> extends Function { new (...args: any[]): T; }


interface DependencyContainerItem<T> {
    type: Type<T>;
    instance?: Object;
}

/**
 * The `DependencyContainer` is a static class that can be used to
 * register dependencies so that implementations can be overridden
 * or mocked.
 */
class DependencyContainer {

    // @ts-ignore
    private container:{[key: symbol]: DependencyContainerItem<any>} = { };

    /**
     * Registers a dependency with the container.
     * The key should be a constant located in the same file as the interface type.
     * @param key Use a symbol with a description, i.e. Symbol("my-dependency")
     * @param type The class to register
     * @param predicate if false, the dependency does not get registered.
     */
    register<T>(key:symbol, type:Type<T>, predicate?:boolean) {
        // @ts-ignore TS7053 dynamic index type
        if (predicate !== false) {
            this.container[key] = {type};
        }
    }

    /**
     * Creates the dependency on first call and returns the dependency from the container
     * @param key The key/symbol of the dependency registered to get.
     * @returns The instantiated class.
     */
    get<T>(key: symbol):T {
        // @ts-ignore TS7053 dynamic index type
        const item = this.container[key];
        if (item === undefined) {
            throw new Error(`[DependencyContainer] Item not registered: ${key.description}`);
        }

        const instance = item.instance;
        if (instance === undefined) {
            try {
                item.instance = new item.type();
            } catch (e:any) {
                // @ts-ignore TS2554 Error constructor has 0-1 arguments
                throw new Error(`[DependencyContainer] Item failed to create: ${key.description}`, {cause:e})
            }
        }
        return item.instance as T;
    }
}


export const dependencyContainer = new DependencyContainer();
export default dependencyContainer;
