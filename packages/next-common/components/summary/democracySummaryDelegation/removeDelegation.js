import React, { useState } from "react";
import { Button } from "../styled";
import RemoveSVG from "next-common/assets/imgs/icons/remove.svg";
import styled from "styled-components";
import Tooltip from "../../tooltip";
import isMoonChain from "next-common/utils/isMoonChain";
import useIsUseMetamask from "next-common/hooks/useIsUseMetamask";
import dynamicPopup from "next-common/lib/dynamic/popup";

const UndelegatePopup = dynamicPopup(() => import("./undelegatePopup"));

const MoonUndelegatePopup = dynamicPopup(() =>
  import("./undelegatePopup/moonPopup"),
);

const RemoveButton = styled(Button)`
  display: flex;
  padding: 7px;
`;

export default function DemocracyRemoveDelegation({ ButtonComponent }) {
  const [isLoading, setIsLoading] = useState(false);
  const [showUndelegatePopup, setShowUndelegatePopup] = useState(false);
  const isUseMetamask = useIsUseMetamask();

  let TheUndelegatePopup = UndelegatePopup;
  if (isMoonChain() && isUseMetamask) {
    TheUndelegatePopup = MoonUndelegatePopup;
  }

  const button = ButtonComponent ? (
    <ButtonComponent
      disabled={isLoading}
      onClick={() => setShowUndelegatePopup(true)}
    />
  ) : (
    <RemoveButton
      disabled={isLoading}
      onClick={() => setShowUndelegatePopup(true)}
    >
      <RemoveSVG />
    </RemoveButton>
  );

  return (
    <>
      <Tooltip content="Remove">
        <div>{button}</div>
      </Tooltip>
      {showUndelegatePopup && (
        <TheUndelegatePopup
          onClose={() => setShowUndelegatePopup(false)}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />
      )}
    </>
  );
}
