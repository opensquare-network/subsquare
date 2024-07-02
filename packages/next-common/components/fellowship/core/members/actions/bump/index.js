import { useSelector } from "react-redux";
import chainOrScanHeightSelector from "next-common/store/reducers/selectors/height";
import { usePageProps } from "next-common/context/page";
import { useMemo, useState } from "react";
import Popup from "./popup";

export default function Bump({ member }) {
  const { address, rank, status: { lastProof } = {} } = member || {};
  const latestHeight = useSelector(chainOrScanHeightSelector);
  const { fellowshipParams } = usePageProps();
  const demotionPeriod = useMemo(() => {
    return rank <= 0
      ? fellowshipParams.offboardTimeout
      : fellowshipParams.demotionPeriod[rank - 1];
  }, [rank, fellowshipParams]);
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
