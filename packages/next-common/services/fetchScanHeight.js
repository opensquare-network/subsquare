import { backendApi } from "./nextApi";

export function fetchScanHeight() {
  return backendApi.fetch("inspect/scan-height").then((resp) => {
    return resp?.result?.value;
  });
}

export function fetchRelayScanHeight() {
  return backendApi.fetch("inspect/relay-scan-height").then((resp) => {
    return resp?.result?.value;
  });
}

export function fetchCoretimeChainHeight() {
  return backendApi.fetch("inspect/coretime-scan-height").then((resp) => {
    return resp?.result?.value;
  });
}
