const BLOCK_QUERY_METHODS = new Set(["getValue", "getValues", "getEntries"]);

class BlockPapi {
  constructor(papi, blockHash) {
    this.blockHash = blockHash;
    this.path = [];
    this.papi = papi;

    const handler = {
      get: (target, prop, receiver) => {
        if (typeof prop === "symbol" || prop in target) {
          return Reflect.get(target, prop, receiver);
        }
        const newPath = [...target.path, prop];
        const fn = (...args) =>
          Promise.resolve().then(() => {
            const queryMethod = fn.path[fn.path.length - 1];
            if (
              fn.path[0] !== "query" ||
              !BLOCK_QUERY_METHODS.has(queryMethod)
            ) {
              throw new Error(
                `BlockPapi: unsupported call path "${fn.path.join(".")}". ` +
                  `Expected query.<Pallet>.<Storage>.(getValue|getValues|getEntries)`,
              );
            }
            const [section, method] = fn.path.slice(1, -1);
            return fn.papi.query[section][method][queryMethod](...args, {
              at: target.blockHash,
            });
          });
        fn.path = newPath;
        fn.blockHash = target.blockHash;
        fn.papi = target.papi;
        return new Proxy(fn, handler);
      },
    };

    return new Proxy(this, handler);
  }
}

export default BlockPapi;
