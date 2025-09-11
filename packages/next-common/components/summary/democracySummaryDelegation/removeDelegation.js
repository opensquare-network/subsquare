import React, { useState } from "react";
import { Button } from "../styled";
import RemoveSVG from "next-common/assets/imgs/icons/remove.svg";
import styled from "styled-components";
import Tooltip from "../../tooltip";
import dynamicPopup from "next-common/lib/dynamic/popup";

const UndelegatePopup = dynamicPopup(() => import("./undelegatePopup"));

const RemoveButton = styled(Button)`
  display: flex;
  padding: 7px;
`;

export default function DemocracyRemoveDelegation({ ButtonComponent }) {
  const [isLoading, setIsLoading] = useState(false);
  const [showUndelegatePopup, setShowUndelegatePopup] = useState(false);

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
        <UndelegatePopup
          onClose={() => setShowUndelegatePopup(false)}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />
      )}
    </>
  );
}
