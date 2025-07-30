import * as foreignAssets from "./assetInfo";

export default function foreignAssetInfo() {
  if (!foreignAssets) return {};

  const foreignAssetsEntries = Object.values(foreignAssets).map(
    ({ id, data }) => [id, data],
  );

  return Object.fromEntries(foreignAssetsEntries);
}
