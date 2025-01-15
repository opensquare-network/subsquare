import { useSelector } from "react-redux";
import chainOrScanHeightSelector from "next-common/store/reducers/selectors/height";
import { useMemo, useState } from "react";
import BumpFellowshipMemberPopup from "./popup";
import { useCoreFellowshipParams } from "next-common/context/collectives/collectives";
import rankToIndex from "next-common/utils/fellowship/rankToIndex";

export function useCanBump(member) {
  const { rank, status: { lastProof } = {} } = member || {};
  const latestHeight = useSelector(chainOrScanHeightSelector);
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

  if (!canBump) {
    return <span className="text14Medium text-textDisabled">Demote</span>;
  }

  return (
    <span
      className="text14Medium text-theme500 cursor-pointer"
      onClick={onClick}
    >
      Demote
    </span>
  );
}

export default function CoreFellowshipBump({ member }) {
  const { address } = member || {};
  const [showPopup, setShowPopup] = useState(false);

  return (
    <>
      <CoreFellowshipBumpButton
        member={member}
        onClick={() => setShowPopup(true)}
      />
      {showPopup && (
        <BumpFellowshipMemberPopup
          who={address}
          onClose={() => setShowPopup(false)}
        />
      )}
    </>
  );
}
