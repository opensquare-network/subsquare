import * as Popover from "@radix-ui/react-popover";
import { OptionItem, OptionWrapper } from "../internalDropdown/styled";
import { SystemEdit, SystemMore, SystemSubtract } from "@osn/icons/subsquare";
import { ActionIconButton } from "./styled";

import dynamicPopup from "next-common/lib/dynamic/popup";
import { useState } from "react";
const RemovePopup = dynamicPopup(() => import("./actions/removePopup"));
const RenamePopup = dynamicPopup(() => import("./actions/renamePopup"));

export default function CellActions({ multisig }) {
  const [showRemovePopup, setShowRemovePopup] = useState(false);
  const [showRenamePopup, setShowRenamePopup] = useState(false);

  if (!multisig) {
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
          <Popover.Content sideOffset={5}>
            <OptionWrapper className="static">
              <OptionItem
                className="flex items-center grow gap-x-2"
                onClick={() => setShowRenamePopup(true)}
              >
                <SystemEdit /> Rename
              </OptionItem>
              <OptionItem
                className="flex items-center grow gap-x-2"
                onClick={() => setShowRemovePopup(true)}
              >
                <SystemSubtract /> Remove
              </OptionItem>
            </OptionWrapper>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
      {showRemovePopup && (
        <RemovePopup
          onClose={() => setShowRemovePopup(false)}
          multisigAddress={multisig.multisigAddress}
        />
      )}
      {showRenamePopup && (
        <RenamePopup
          onClose={() => setShowRenamePopup(false)}
          multisig={multisig}
        />
      )}
    </>
  );
}
