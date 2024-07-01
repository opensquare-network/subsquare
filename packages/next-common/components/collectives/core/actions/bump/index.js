import { useSelector } from "react-redux";
import chainOrScanHeightSelector from "next-common/store/reducers/selectors/height";
import { useMemo, useState } from "react";
import Popup from "./popup";
import { useCoreFellowshipParams } from "next-common/context/collectives/collectives";

export default function CoreFellowshipBump({ member }) {
  const { address, rank, status: { lastProof } = {} } = member || {};
  const latestHeight = useSelector(chainOrScanHeightSelector);
  const params = useCoreFellowshipParams();
  const demotionPeriod = useMemo(() => {
    return rank <= 0 ? params.offboardTimeout : params.demotionPeriod[rank - 1];
  }, [rank, params]);
  const canBump =
    latestHeight >= lastProof + demotionPeriod && demotionPeriod > 0;

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
