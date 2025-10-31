import { SystemMore } from "@osn/icons/subsquare";
import * as Popover from "@radix-ui/react-popover";
import { MenuDelegation } from "@osn/icons/subsquare";
import { isNil } from "lodash-es";
import { useState } from "react";
import { ActionIconButton } from "next-common/components/multisigs/styled";
import {
  OptionItem,
  OptionWrapper,
} from "next-common/components/internalDropdown/styled";
import dynamicPopup from "next-common/lib/dynamic/popup";

const JoinPopup = dynamicPopup(() =>
  import("next-common/components/staking/actions/joinPopup"),
);
const BondExtraPopup = dynamicPopup(() =>
  import("next-common/components/staking/actions/bondExtraPopup"),
);
const ClaimPayoutPopup = dynamicPopup(() =>
  import("next-common/components/staking/actions/claimPayoutPopup"),
);

export default function CellActions({ value }) {
  const [showJoinPopup, setShowJoinPopup] = useState(false);
  const [showBondExtraPopup, setShowBondExtraPopup] = useState(false);
  const [showClaimPayoutPopup, setShowClaimPayoutPopup] = useState(false);

  if (isNil(value.poolId)) {
    return null;
  }

  return (
    <>
      <Popover.Root>
        <Popover.Trigger>
          <div>
            <ActionIconButton>
              <SystemMore className="w-4 h-4" />
            </ActionIconButton>
          </div>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content side="top" align="end" sideOffset={5}>
            <OptionWrapper className="static !shadow-200 text14Medium">
              <OptionItem
                disabled={value.state !== "Open"}
                className="flex items-center grow gap-x-2"
                onClick={() => setShowJoinPopup(true)}
              >
                <MenuDelegation className="w-5 h-5" /> Join Pool
              </OptionItem>
              <OptionItem
                disabled={value.state !== "Open"}
                className="flex items-center grow gap-x-2"
                onClick={() => setShowBondExtraPopup(true)}
              >
                <MenuDelegation className="w-5 h-5" /> Bond Extra
              </OptionItem>
              <OptionItem
                disabled={value.state !== "Open"}
                className="flex items-center grow gap-x-2"
                onClick={() => setShowClaimPayoutPopup(true)}
              >
                <MenuDelegation className="w-5 h-5" /> Claim Payout
              </OptionItem>
            </OptionWrapper>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
      {showJoinPopup && (
        <JoinPopup
          poolId={value.poolId}
          onClose={() => setShowJoinPopup(false)}
        />
      )}
      {showBondExtraPopup && (
        <BondExtraPopup
          poolId={value.poolId}
          onClose={() => setShowBondExtraPopup(false)}
        />
      )}
      {showClaimPayoutPopup && (
        <ClaimPayoutPopup
          poolId={value.poolId}
          onClose={() => setShowClaimPayoutPopup(false)}
        />
      )}
    </>
  );
}
