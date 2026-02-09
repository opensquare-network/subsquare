function assert(condition, message) {
  if (!condition) {
    throw new Error("BlockPapi: " + message);
  }
}

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
        const fn = (...args) => {
          assert(fn.path[0] === "query", "First property must be query");
          assert(
            fn.path[fn.path.length - 1] === "getValue",
            "Last method must be getValue",
          );
          const [section, method] = fn.path.slice(1, -1);
          // console.log(
          //   `BlockPapi: Calling papi.query.${section}.${method}.getValue with args:`,
          //   args,
          // );
          return Promise.resolve().then(() =>
            fn.papi.query[section][method].getValue(...args, {
              at: target.blockHash,
            }),
          );
        };
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
