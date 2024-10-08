import useSubStorage from "next-common/hooks/common/useSubStorage";
import PrimaryButton from "next-common/lib/button/primary";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useAcceptCuratorPopup } from "./useAcceptCuratorPopup";
import Tooltip from "next-common/components/tooltip";
import { isSameAddress } from "next-common/utils";
import AddressUser from "next-common/components/user/addressUser";
import CuratorActionHint from "../../common/curatorActionHint";

export default function BountyAcceptCuratorButton({
  pallet = "bounties",
  params = [],
} = {}) {
  const storage = pallet;

  const address = useRealAddress();
  const { showPopupFn, component } = useAcceptCuratorPopup(pallet, params);

  const { result, loading } = useSubStorage(pallet, storage, params);

  if (loading || result?.isNone) {
    return null;
  }

  const { status } = result?.unwrap?.() || {};

  if (!status?.isCuratorProposed) {
    return null;
  }

  const curator = status?.asCuratorProposed?.curator?.toString();

  const disabled = !isSameAddress(curator, address);

  return (
    <>
      <div>
        <Tooltip
          content={
            disabled ? (
              <div className="flex items-center gap-x-2">
                Only{" "}
                <AddressUser
                  addressClassName="!text-textPrimaryContrast"
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
        </Tooltip>

        <CuratorActionHint className="mt-4" />
      </div>

      {component}
    </>
  );
}
