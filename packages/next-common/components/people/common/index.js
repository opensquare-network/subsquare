export function formatIdentityInfo(identityInfo) {
  const result = {};

  for (const key in identityInfo) {
    if (identityInfo[key]) {
      result[key] = { Raw: identityInfo[key] };
    } else {
      result[key] = null;
    }
  }

  return result;
}

export const isIdentityEmpty = (identityInfo) => {
  return Object.values(identityInfo ?? {}).filter(Boolean).length === 0;
};
