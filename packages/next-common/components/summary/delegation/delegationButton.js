import { useState } from "react";
import { Button } from "next-common/components/summary/styled";
import AddSVG from "next-common/assets/imgs/icons/add.svg";
import RemoveSVG from "next-common/assets/imgs/icons/remove.svg";
import Tooltip from "next-common/components/tooltip";
import styled from "styled-components";
import isMoonChain from "next-common/utils/isMoonChain";
import useIsUseMetamask from "next-common/hooks/useIsUseMetamask";
import dynamicPopup from "next-common/lib/dynamic/popup";

const DelegatePopup = dynamicPopup(() =>
  import("next-common/components/gov2/delegatePopup"),
);

const MoonDelegatePopup = dynamicPopup(() =>
  import("next-common/components/gov2/delegatePopup/moonPopup"),
);

const UndelegatePopup = dynamicPopup(() => import("./undelegatePopup"));

const MoonUndelegatePopup = dynamicPopup(() =>
  import("./undelegatePopup/moonPopup"),
);

const RemoveButton = styled(Button)`
  display: flex;
  padding: 7px;
`;

export default function DelegationButton({ delegating, trackId }) {
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
          onClose={() => setShowDelegatePopup(false)}
        />
      )}
      {showUndelegatePopup && (
        <TheUndelegatePopup
          trackId={trackId}
          onClose={() => setShowUndelegatePopup(false)}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />
      )}
    </>
  );
}
