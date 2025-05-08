import useChainOrScanHeight from "next-common/hooks/height";
import { useMemo, useState } from "react";
import BumpFellowshipMemberPopup from "./popup";
import { useCoreFellowshipParams } from "next-common/context/collectives/collectives";
import rankToIndex from "next-common/utils/fellowship/rankToIndex";
import Button from "next-common/lib/button";

export function useCanBump(member) {
  const { rank, status: { lastProof } = {} } = member || {};
  const latestHeight = useChainOrScanHeight();
  const params = useCoreFellowshipParams();
  const demotionPeriod = useMemo(() => {
    return rank <= 0
      ? params.offboardTimeout
      : params.demotionPeriod[rankToIndex(rank)];
  }, [rank, params]);
  return demotionPeriod > 0 && latestHeight >= lastProof + demotionPeriod;
}

export function CoreFellowshipBumpButton({ member, onClick }) {
  const canBump = useCanBump(member);
  const { rank } = member || {};

  return (
    <Button
      className={`border-0 p-0 h-auto ${
        canBump ? "text-theme500" : "text-textDisabled"
      }`}
      onClick={onClick}
      disabled={!canBump}
    >
      {rank <= 0 ? "Offboard" : "Demote"}
    </Button>
  );
}

export default function CoreFellowshipBump({ member }) {
  const { address, rank } = member || {};
  const [showPopup, setShowPopup] = useState(false);

  return (
    <>
      <CoreFellowshipBumpButton
        member={member}
        onClick={() => setShowPopup(true)}
      />
      {showPopup && (
        <BumpFellowshipMemberPopup
          isCandidate={rank <= 0}
          who={address}
          onClose={() => setShowPopup(false)}
        />
      )}
    </>
  );
}
