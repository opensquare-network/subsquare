export default function useBountyCuratorData(onchainData) {
  if (onchainData?.meta?.status) {
    const status = onchainData.meta.status;

    for (const key in status) {
      if (status[key] && status[key].curator) {
        return status[key].curator;
      }
    }
  }

  return "";
}
