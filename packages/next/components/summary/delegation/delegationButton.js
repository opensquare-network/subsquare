import { useState } from "react";
import { Button } from "next-common/components/summary/styled";
import DelegatePopup from "components/gov2/delegatePopup";
import AddSVG from "next-common/assets/imgs/icons/add.svg";
import RemoveSVG from "next-common/assets/imgs/icons/remove.svg";
import UndelegatePopup from "./undelegatePopup";
import Tooltip from "next-common/components/tooltip";
import styled from "styled-components";

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

  const addDelegationButton = (
    <Button onClick={() => setShowDelegatePopup(true)}>
      <AddSVG />
      My Delegate
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
        <DelegatePopup
          trackId={trackId}
          onInBlock={onDelegateInBlock}
          onClose={() => setShowDelegatePopup(false)}
        />
      )}
      {showUndelegatePopup && (
        <UndelegatePopup
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
