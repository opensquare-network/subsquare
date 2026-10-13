// A SCALE decoder allocates an array as large as the length it reads from the
// payload, before it can find out that the payload is not the value it is
// decoding. A payload of a few bytes read as a vector can therefore ask for an
// array of hundreds of millions of entries, which freezes the page and can
// exhaust its memory. The inputs of a decoder are often payloads of a chain
// that anyone can write, so the allocation is bounded while it decodes: no
// value holds more elements than the bytes it was decoded from.
export function withBoundedArrayLength(limit, decode) {
  const NativeArray = Array;

  const boundLength = (args) => {
    const [length] = args;
    if (args.length === 1 && typeof length === "number" && length > limit) {
      throw new RangeError(
        `Refusing to allocate an array of ${length} elements while decoding ${limit} bytes`,
      );
    }
  };

  globalThis.Array = new Proxy(NativeArray, {
    construct: (target, args, newTarget) => {
      boundLength(args);
      return Reflect.construct(target, args, newTarget);
    },
    apply: (target, thisArg, args) => {
      boundLength(args);
      return Reflect.construct(target, args, target);
    },
  });

  try {
    return decode();
  } finally {
    globalThis.Array = NativeArray;
  }
}
