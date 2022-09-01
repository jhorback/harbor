

interface Type<T> extends Function { new (...args: any[]): T; }


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

    private container:{[key: symbol]: DependencyContainerItem<any>} = { };

    /**
     * Registers a dependency with the container.
     * The key should be a constant located in the same file as the interface type.
     * @param key Use a symbol with a description, i.e. Symbol("my-dependency")
     * @param type The class to register
     */
    register<T>(key:symbol, type:Type<T>) {
        this.container[key] = {type};
    }

    /**
     * Creates the dependency on first call and returns the dependency from the container
     * @param key The key/symbol of the dependency registered to get.
     * @returns The instantiated class.
     */
    get<T>(key: symbol):T {
        const item = this.container[key];
        if (item === null) {
            throw new Error(`[DependencyContainer] Item not registered: ${key.description}`);
        }

        const instance = item.instance;
        if (instance === undefined) {
            try {
                item.instance = new item.type();
            } catch (e:any) {
                throw new Error(`[DependencyContainer] Item failed to create: ${key.description}`, {cause:e})
            }
        }
        return item.instance as T;
    }
}


const dc = new DependencyContainer();
export default dc;




