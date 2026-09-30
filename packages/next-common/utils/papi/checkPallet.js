export function createCheckPallet(pallets) {
  return (palletName, storageName) => {
    if (!palletName) {
      return false;
    }

    const pallet = pallets?.find((item) => item.name === palletName);
    if (!pallet) {
      return false;
    }

    if (!storageName) {
      return true;
    }

    return !!pallet?.storage?.items?.some((item) => item.name === storageName);
  };
}
