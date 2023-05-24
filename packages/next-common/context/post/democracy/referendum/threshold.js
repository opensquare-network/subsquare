import useDemocracyMeta from "./useDemocracyMeta";

export default function useDemocracyThreshold() {
  const meta = useDemocracyMeta();
  return meta.threshold;
}
