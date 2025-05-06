import { backendApi } from "./nextApi";

export function fetchScanHeight() {
  return backendApi.fetch("inspect/scan-height").then((resp) => {
    return resp?.result?.value;
  });
}
