import PrimaryButton from "next-common/lib/button/primary";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { isSameAddress } from "next-common/utils";
import { useContextPapi } from "next-common/context/papi";
import { useOnchainData } from "next-common/context/post";
import { isNil } from "lodash-es";
import { useEffect, useState } from "react";
import { useAcceptCuratorPopup } from "./useAcceptCuratorPopup";

export default function MultiAssetBountyAcceptCuratorButton() {
  const { bountyIndex } = useOnchainData();
  const { api: papi, checkPallet } = useContextPapi();
  const address = useRealAddress();
  const [result, setResult] = useState(null);
  const { showPopupFn, component } = useAcceptCuratorPopup(bountyIndex);

  useEffect(() => {
    if (
      !papi ||
      !checkPallet("MultiAssetBounties", "Bounties") ||
      isNil(bountyIndex)
    ) {
      return;
    }

    papi.query.MultiAssetBounties.Bounties.getValue(bountyIndex).then((value) =>
      setResult(value),
    );
  }, [papi, checkPallet, bountyIndex]);

  const { status } = result || {};

  // accept_curator requires the bounty in `Funded` state and can only be
  // called by the proposed curator.
  if (status?.type !== "Funded") {
    return null;
  }

  const curator = status?.value?.curator;
  if (!curator || !isSameAddress(curator, address)) {
    return null;
  }

  return (
    <>
      <PrimaryButton className="w-full" onClick={() => showPopupFn()}>
        Accept Curator
      </PrimaryButton>

      {component}
    </>
  );
}
