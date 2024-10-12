import { useBlockHeight } from "next-common/hooks/common/useBlockHeight";
import { useMemo, useState } from "react";
import Popup from "./popup";
import { useCoreFellowshipParams } from "next-common/context/collectives/collectives";
import rankToIndex from "next-common/utils/fellowship/rankToIndex";

export default function CoreFellowshipBump({ member }) {
  const { address, rank, status: { lastProof } = {} } = member || {};
  const latestHeight = useBlockHeight();
  const params = useCoreFellowshipParams();
  const demotionPeriod = useMemo(() => {
    return rank <= 0
      ? params.offboardTimeout
      : params.demotionPeriod[rankToIndex(rank)];
  }, [rank, params]);
  const canBump =
    demotionPeriod > 0 && latestHeight >= lastProof + demotionPeriod;

  const [showPopup, setShowPopup] = useState(false);

  if (!canBump) {
    return <span className="text14Medium text-textDisabled">Bump</span>;
  }

  return (
    <>
      <span
        className="text14Medium text-theme500 cursor-pointer"
        onClick={() => setShowPopup(true)}
      >
        Bump
      </span>
      {showPopup && <Popup who={address} onClose={() => setShowPopup(false)} />}
    </>
  );
}
