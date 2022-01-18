const ignoreHeights = [2496, 2502];

function filterOutIgnoredHeights(heights = []) {
  return heights.filter((height) => !ignoreHeights.includes(height));
}

module.exports = {
  filterOutIgnoredHeights,
};
