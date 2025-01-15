import nextApi from "./nextApi";

export function fetchScanHeight() {
  return nextApi.fetch("inspect/scan-height").then((resp) => {
    return resp?.result?.value;
  });
}
