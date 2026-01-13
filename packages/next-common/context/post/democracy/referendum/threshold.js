import useDemocracyReferendumStatus from "next-common/hooks/democracy/useDemocracyReferendumStatus";

export default function useDemocracyThreshold() {
  const referendumStatus = useDemocracyReferendumStatus();
  return referendumStatus.threshold;
}
