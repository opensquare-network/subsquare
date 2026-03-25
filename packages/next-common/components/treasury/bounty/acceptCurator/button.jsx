import PrimaryButton from "next-common/lib/button/primary";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useAcceptCuratorPopup } from "./useAcceptCuratorPopup";
import Tooltip from "next-common/components/tooltip";
import { isSameAddress } from "next-common/utils";
import AddressUser from "next-common/components/user/addressUser";
import { useContextPapiApi } from "next-common/context/papi";
import { useEffect, useState } from "react";

export default function BountyAcceptCuratorButton({
  pallet = "Bounties",
  params = [],
} = {}) {
  const [result, setResult] = useState(null);
  const storage = pallet;

  const address = useRealAddress();
  const { showPopupFn, component } = useAcceptCuratorPopup(
    pallet.toLocaleLowerCase(),
    params,
  );
  const papi = useContextPapiApi();

  useEffect(() => {
    if (!papi) {
      return;
    }
    papi.query[pallet]?.[storage]
      ?.getValue(...params)
      .then((result) => setResult(result));
  }, [papi, pallet, storage, params]);

  const { status } = result || {};

  if (status?.type !== "CuratorProposed") {
    return null;
  }

  const curator = status?.value?.curator;

  const disabled = !isSameAddress(curator, address);

  return (
    <Tooltip
      content={
        disabled ? (
          <div className="flex items-center gap-x-2">
            Only{" "}
            <AddressUser
              className="text14Medium text-textPrimaryContrast"
              add={curator}
              noEvent
            />
            can accept curator
          </div>
        ) : null
      }
    >
      <PrimaryButton
        disabled={disabled}
        className="w-full"
        onClick={() => {
          showPopupFn();
        }}
      >
        Accept Curator
      </PrimaryButton>

      {component}
    </Tooltip>
  );
}
