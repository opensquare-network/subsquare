import { useOnchainData } from "next-common/context/post";
import { useEffect, useState } from "react";
import useApi from "next-common/utils/hooks/useApi";
import useIsMounted from "next-common/utils/hooks/useIsMounted";
import SecondaryButton from "next-common/components/buttons/secondaryButton";
import dynamic from "next/dynamic";
import { useSelector } from "react-redux";
import { latestHeightSelector } from "next-common/store/reducers/chainSlice";
import ClaimedInfo from "./ClaimedInfo";

const Popup = dynamic(() => import("../popup"), {
  ssr: false,
});

export default function Claim() {
  const onChain = useOnchainData();
  const api = useApi();
  const [status, setStatus] = useState(null); // on chain status
  const isMounted = useIsMounted();
  const [showPopup, setShowPopup] = useState(false);
  const chainHeight = useSelector(latestHeightSelector);

  useEffect(() => {
    if (!api || !api.query.childBounties) {
      return;
    }

    let unsub;
    api.query.childBounties.childBounties(onChain?.parentBountyId, onChain?.index, (meta) => {
      if (meta.isSome) {
        const unwrapped = meta.unwrap();
        setStatus(unwrapped.status.toJSON());
      } else {
        setStatus(null);
      }
    }).then(result => {
      unsub = result;
    });

    return () => {
      if (unsub) {
        unsub();
      }
    };
  }, [api, onChain, isMounted]);

  if (!status || !status.pendingPayout) {
    return <ClaimedInfo />;
  }

  const { unlockAt } = status.pendingPayout || {};

  return <>
    <SecondaryButton
      isFill
      disabled={chainHeight < unlockAt}
      onClick={() => setShowPopup(true)}>
      Claim
    </SecondaryButton>

    {showPopup && (
      <Popup
        childBounty={onChain}
        onClose={() => setShowPopup(false)}
      />
    )}
  </>;
}
