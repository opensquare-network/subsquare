import { usePageProperties } from "next-common/context/page";
import { useSubScanHeight } from "next-common/hooks/scanHeight";

export function ScanHeightSubscriber() {
  const { scanHeight } = usePageProperties();
  useSubScanHeight(scanHeight);
  return null;
}
