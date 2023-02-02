import React, { useState } from "react";
import { Button } from "next-common/components/summary/styled";
import ListSVG from "next-common/assets/imgs/icons/list.svg";
import styled from "styled-components";
import Tooltip from "next-common/components/tooltip";
import BeenDelegatedListPopup from "./beenDelegatedListPopup";

const ListButton = styled(Button)`
  display: flex;
  padding: 7px;
`;

export default function BeenDelegatedListButton({ trackId }) {
  const [showPopup, setShowPopup] = useState();

  const button = (
    <ListButton onClick={() => setShowPopup(true)}>
      <ListSVG />
    </ListButton>
  );

  return (
    <>
      <Tooltip content="Delegated detail">
        <div>{button}</div>
      </Tooltip>
      {showPopup && (
        <BeenDelegatedListPopup trackId={trackId} setShow={setShowPopup} />
      )}
    </>
  );
}
