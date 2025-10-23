import * as Popover from "@radix-ui/react-popover";
import {
  OptionItem,
  OptionWrapper,
} from "next-common/components/internalDropdown/styled";
import { ActionIconButton } from "next-common/components/multisigs/styled";
import dynamicPopup from "next-common/lib/dynamic/popup";
import { useState } from "react";
import {
  SystemTransfer,
  SystemCrosschain,
  SystemMore,
} from "@osn/icons/subsquare";
import { useAccountTransferPopup } from "next-common/components/overview/accountInfo/hook/useAccountTransferPopup";

const ParaChainTeleportPopup = dynamicPopup(() =>
  import("../paraChainTeleportPopup"),
);

export default function CellActions({ asset }) {
  const [showTeleportPopup, setShowTeleportPopup] = useState(false);
  const { showPopup: showAccountTransferPopup, component: transferPopup } =
    useAccountTransferPopup();

  if (!asset) {
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
            <OptionWrapper className="static !shadow-200">
              <OptionItem
                className="flex items-center grow gap-x-2"
                onClick={() => showAccountTransferPopup()}
              >
                <SystemTransfer /> Transfer
              </OptionItem>
              <OptionItem
                className="flex items-center grow gap-x-2"
                onClick={() => setShowTeleportPopup(true)}
              >
                <SystemCrosschain /> Cross-chain
              </OptionItem>
            </OptionWrapper>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
      {transferPopup}
      {showTeleportPopup && (
        <ParaChainTeleportPopup
          onClose={() => setShowTeleportPopup(false)}
          asset={asset}
        />
      )}
    </>
  );
}
