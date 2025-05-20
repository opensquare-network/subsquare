export function isOnlyOthersCategory(data) {
  if (!data) return false;
  const keys = Object.keys(data);
  if (!data["others"] || data["others"].length === 0) return false;

  return keys.every((key) => {
    if (key === "others") return true;
    return Array.isArray(data[key]) && data[key].length === 0;
  });
}

export function isOthersExceedMax(data, otherCategoryMaxCount) {
  return data?.others && data.others.length > otherCategoryMaxCount;
}
