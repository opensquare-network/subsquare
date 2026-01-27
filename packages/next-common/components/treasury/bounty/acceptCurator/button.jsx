import PrimaryButton from "next-common/lib/button/primary";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useAcceptCuratorPopup } from "./useAcceptCuratorPopup";
import Tooltip from "next-common/components/tooltip";
import { isSameAddress } from "next-common/utils";
import AddressUser from "next-common/components/user/addressUser";
import { useOnchainData } from "next-common/context/post";
import { has } from "lodash-es";

export default function BountyAcceptCuratorButton({
  pallet = "bounties",
  params = [],
} = {}) {
  const { meta } = useOnchainData();
  const { status = {} } = meta || {};

  const address = useRealAddress();
  const { showPopupFn, component } = useAcceptCuratorPopup(pallet, params);

  if (!has(status, "curatorProposed")) {
    return null;
  }

  const curator = status?.curatorProposed?.curator;

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
