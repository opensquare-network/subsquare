import { useState } from "react";
import { Button } from "next-common/components/summary/styled";
import DelegatePopup from "components/gov2/delegatePopup";
import MoonDelegatePopup from "components/gov2/delegatePopup/moonPopup";
import AddSVG from "next-common/assets/imgs/icons/add.svg";
import RemoveSVG from "next-common/assets/imgs/icons/remove.svg";
import UndelegatePopup from "./undelegatePopup";
import MoonUndelegatePopup from "./undelegatePopup/moonPopup";
import Tooltip from "next-common/components/tooltip";
import styled from "styled-components";
import isMoonChain from "next-common/utils/isMoonChain";
import useIsUseMetamask from "next-common/hooks/useIsUseMetamask";

const RemoveButton = styled(Button)`
  display: flex;
  padding: 7px;
`;

export default function DelegationButton({
  delegating,
  trackId,
  onUndelegateInBlock,
  onDelegateInBlock,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [showDelegatePopup, setShowDelegatePopup] = useState(false);
  const [showUndelegatePopup, setShowUndelegatePopup] = useState(false);
  const isUseMetamask = useIsUseMetamask();

  let TheDelegatePopup = DelegatePopup;
  let TheUndelegatePopup = UndelegatePopup;
  if (isMoonChain() && isUseMetamask) {
    TheDelegatePopup = MoonDelegatePopup;
    TheUndelegatePopup = MoonUndelegatePopup;
  }

  const addDelegationButton = (
    <Button onClick={() => setShowDelegatePopup(true)}>
      <AddSVG />
      New Delegate
    </Button>
  );

  const removeDelegationButton = (
    <Tooltip content="Remove">
      <div>
        <RemoveButton
          disabled={isLoading}
          onClick={() => setShowUndelegatePopup(true)}
        >
          <RemoveSVG />
        </RemoveButton>
      </div>
    </Tooltip>
  );

  return (
    <>
      {delegating ? removeDelegationButton : addDelegationButton}
      {showDelegatePopup && (
        <TheDelegatePopup
          tracks={[trackId]}
          onInBlock={onDelegateInBlock}
          onClose={() => setShowDelegatePopup(false)}
        />
      )}
      {showUndelegatePopup && (
        <TheUndelegatePopup
          trackId={trackId}
          onInBlock={onUndelegateInBlock}
          onClose={() => setShowUndelegatePopup(false)}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />
      )}
    </>
  );
}
