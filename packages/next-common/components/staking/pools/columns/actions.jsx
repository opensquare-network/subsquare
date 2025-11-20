import {
  SystemMore,
  SystemPlus,
  SystemUpload,
  TrackFastPromotion,
} from "@osn/icons/subsquare";
import { isNil } from "lodash-es";
import { useMemo, useState } from "react";
import * as Popover from "@radix-ui/react-popover";
import {
  OptionItem,
  OptionWrapper,
} from "next-common/components/internalDropdown/styled";
import { ActionIconButton } from "next-common/components/multisigs/styled";
import dynamicPopup from "next-common/lib/dynamic/popup";
import { useMyPool } from "next-common/context/staking/myPool";

const JoinPopup = dynamicPopup(() =>
  import("next-common/components/staking/pools/actions/joinPopup"),
);

const BondExtraPopup = dynamicPopup(() =>
  import("next-common/components/staking/pools/actions/bondExtraPopup"),
);

const UnbondPopup = dynamicPopup(() =>
  import("next-common/components/staking/pools/actions/unBondPopup"),
);

export default function CellActions({ value }) {
  const { poolMember } = useMyPool();
  if (isNil(value)) {
    return null;
  }

  const hasMyPool = !isNil(poolMember);
  const isMyPool =
    hasMyPool && Number(value.poolId) === Number(poolMember?.poolId);
  const isDisabled = hasMyPool && !isMyPool;

  const isStateNeeActions =
    value.state === "Open" || (hasMyPool && value.state === "Destroying");

  if (isDisabled || !isStateNeeActions) {
    return (
      <div className="flex justify-end">
        <ActionIconButton className={"opacity-50 cursor-default"}>
          <SystemMore className="w-4 h-4" />
        </ActionIconButton>
      </div>
    );
  }

  return <CellActionsImpl value={value} />;
}

function CellActionsImpl({ value }) {
  const { poolMember } = useMyPool();
  const [showJoinPopup, setShowJoinPopup] = useState(false);
  const [showBondExtraPopup, setShowBondExtraPopup] = useState(false);
  const [showUnbondPopup, setShowUnbondPopup] = useState(false);

  const menuItems = useMemo(() => {
    return [
      isNil(poolMember) && (
        <OptionItem
          key="join"
          className="flex items-center grow gap-x-2"
          onClick={() => setShowJoinPopup(true)}
        >
          <SystemPlus className="w-5 h-5" /> Join
        </OptionItem>
      ),
      !isNil(poolMember) && (
        <OptionItem
          key="bondExtra"
          className="flex items-center grow gap-x-2"
          onClick={() => setShowBondExtraPopup(true)}
        >
          <TrackFastPromotion className="w-5 h-5" /> Bond Extra
        </OptionItem>
      ),
      !isNil(poolMember) && (
        <OptionItem
          key="unbond"
          className="flex items-center grow gap-x-2"
          onClick={() => setShowUnbondPopup(true)}
        >
          <SystemUpload className="w-5 h-5" /> Unbond
        </OptionItem>
      ),
    ].filter(Boolean);
  }, [poolMember]);

  return (
    <>
      <Popover.Root>
        <Popover.Trigger>
          <div className="flex justify-end">
            <ActionIconButton>
              <SystemMore className="w-4 h-4" />
            </ActionIconButton>
          </div>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content side="top" align="end" sideOffset={5}>
            <OptionWrapper className="static !shadow-200 text14Medium">
              {menuItems}
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
      {showUnbondPopup && (
        <UnbondPopup
          poolId={value.poolId}
          onClose={() => setShowUnbondPopup(false)}
        />
      )}
    </>
  );
}
