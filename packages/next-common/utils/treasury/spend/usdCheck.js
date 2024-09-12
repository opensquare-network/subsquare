import { getAssetByMetaV3, getParachainIdV3 } from "./getAssetByMetaV3";
import { getAssetByMetaV4, getParachainIdV4 } from "./getAssetByMetaV4";

export function getParachainIdByMeta(meta = {}) {
  const { v3, v4 } = meta?.assetKind || {};
  if (v3) {
    return getParachainIdV3(v3.location);
  } else if (v4) {
    return getParachainIdV4(v4.location);
  }
  return null;
}

export function getAssetByMeta(meta = {}) {
  const { v3, v4 } = meta?.assetKind || {};
  if (v3) {
    return getAssetByMetaV3(v3);
  } else if (v4) {
    return getAssetByMetaV4(v4);
  }
  return null;
}
