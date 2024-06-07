function isAssetHub(location = {}) {
  const { parents, interior } = location || {};
  return parents === 0 && interior?.x1?.parachain === 1000;
}

function _isAssetHubX2(assetId = {}) {
  const { parents, interior } = assetId?.concrete || {};
  if (parents !== 0) {
    return false;
  }

  const x2 = interior?.x2;
  return x2 && Array.isArray(x2);
}

function isUsdt(assetId = {}) {
  if (!_isAssetHubX2(assetId)) {
    return false;
  }

  const x2 = assetId?.concrete?.interior?.x2;
  return x2[0]?.palletInstance === 50 && x2[1]?.generalIndex === 1984;
}

function isUsdc(assetId = {}) {
  if (!_isAssetHubX2(assetId)) {
    return false;
  }

  const x2 = assetId?.concrete?.interior?.x2;
  return x2[0]?.palletInstance === 50 && x2[1]?.generalIndex === 1337;
}

export function isUsdtByMeta(meta = {}) {
  const { location, assetId } = meta?.assetKind?.v3 || {};
  return isAssetHub(location) && isUsdt(assetId);
}

export function isUsdcByMeta(meta = {}) {
  const { location, assetId } = meta?.assetKind?.v3 || {};
  return isAssetHub(location) && isUsdc(assetId);
}
