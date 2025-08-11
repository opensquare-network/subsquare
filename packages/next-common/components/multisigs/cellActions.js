import * as Popover from "@radix-ui/react-popover";
import { OptionItem, OptionWrapper } from "../internalDropdown/styled";
import {
  SystemEdit,
  SystemMore,
  SystemSubtract,
  MenuMultisig,
  SystemRelatives,
} from "@osn/icons/subsquare";
import { ActionIconButton } from "./styled";

import dynamicPopup from "next-common/lib/dynamic/popup";
import { useState } from "react";
import { normalizeAddress } from "next-common/utils/address";
import { MultisigProvider } from "next-common/context/multisig";
const RemovePopup = dynamicPopup(() => import("./actions/removePopup"));
const RenamePopup = dynamicPopup(() => import("./actions/renamePopup"));
const MultisigPopup = dynamicPopup(() => import("./actions/composeCallPopup"));
const RelativesPopup = dynamicPopup(() =>
  import("next-common/components/relationshipPopup"),
);

export default function CellActions({ multisig }) {
  const [showRemovePopup, setShowRemovePopup] = useState(false);
  const [showRenamePopup, setShowRenamePopup] = useState(false);
  const [showNewMultisigPopup, setShowNewMultisigPopup] = useState(false);
  const [showRelativesPopup, setShowRelativesPopup] = useState(false);

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
          <Popover.Content side="top" align="end" sideOffset={5}>
            <OptionWrapper className="static !shadow-200 text14Medium">
              <MultisigProvider multisig={multisig}>
                <OptionItem
                  className="flex items-center grow gap-x-2"
                  onClick={() => setShowNewMultisigPopup(true)}
                >
                  <MenuMultisig className="w-5 h-5" /> New Multisig
                </OptionItem>
                {showRelativesPopup && (
                  <RelativesPopup
                    onClose={() => setShowRelativesPopup(false)}
                    sourceAddress={normalizeAddress(multisig.multisigAddress)}
                  />
                )}
              </MultisigProvider>
              <OptionItem
                className="flex items-center grow gap-x-2"
                onClick={() => setShowRelativesPopup(true)}
              >
                <SystemRelatives className="w-5 h-5" /> Relatives
              </OptionItem>
              <OptionItem
                className="flex items-center grow gap-x-2"
                onClick={() => setShowRenamePopup(true)}
              >
                <SystemEdit className="w-5 h-5" /> Rename
              </OptionItem>
              <OptionItem
                className="flex items-center grow gap-x-2"
                onClick={() => setShowRemovePopup(true)}
              >
                <SystemSubtract className="w-5 h-5" /> Remove
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
      {showNewMultisigPopup && (
        <MultisigPopup
          onClose={() => setShowNewMultisigPopup(false)}
          multisig={multisig}
        />
      )}
    </>
  );
}
