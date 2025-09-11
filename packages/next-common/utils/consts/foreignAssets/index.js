import * as foreignAssets from "./assetInfo";

function getForeignAssetInfo() {
  if (!foreignAssets) return {};

  const foreignAssetsEntries = Object.values(foreignAssets).map(
    ({ id, data }) => [id, data],
  );

  return Object.fromEntries(foreignAssetsEntries);
}

export const foreignAssetInfo = getForeignAssetInfo();
