function normalizeKhalaArg(type, name, value) {
  if (["TokenomicParams", "TokenomicParameters"].includes(type)) {
    const params = {};
    for (const [k, v] of value.entries()) {
      params[k] = v.toString();
    }
    return params;
  }

  return value.toJSON();
}

module.exports = {
  normalizeKhalaArg,
};
