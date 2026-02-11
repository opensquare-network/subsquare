const asyncStorageStub = {
  getItem: async () => null,
  setItem: async () => undefined,
  removeItem: async () => undefined,
  clear: async () => undefined,
  getAllKeys: async () => [],
  multiGet: async () => [],
  multiSet: async () => undefined,
  multiRemove: async () => undefined,
};

export default asyncStorageStub;
