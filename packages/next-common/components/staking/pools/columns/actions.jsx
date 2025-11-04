import { MenuDelegation } from "@osn/icons/subsquare";
import { isNil } from "lodash-es";
import { useState } from "react";
import { ActionIconButton } from "next-common/components/multisigs/styled";
import dynamicPopup from "next-common/lib/dynamic/popup";

const JoinPopup = dynamicPopup(() =>
  import("next-common/components/staking/actions/joinPopup"),
);

export default function CellActions({ value }) {
  const [showJoinPopup, setShowJoinPopup] = useState(false);

  if (isNil(value)) {
    return null;
  }

  return (
    <>
      <div className="flex justify-end">
        <ActionIconButton onClick={() => setShowJoinPopup(true)}>
          <MenuDelegation className="w-5 h-5" />
        </ActionIconButton>
      </div>
      {showJoinPopup && (
        <JoinPopup
          poolId={value.poolId}
          onClose={() => setShowJoinPopup(false)}
        />
      )}
    </>
  );
}
