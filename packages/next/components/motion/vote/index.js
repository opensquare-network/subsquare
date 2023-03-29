import styled from "styled-components";
import { useState } from "react";
import dynamic from "next/dynamic";
import { emptyFunction } from "next-common/utils";
import { useDetailType } from "next-common/context/page";
import Voters from "./voters";
import Action from "./action";

const Popup = dynamic(() => import("./popup"), {
  ssr: false,
});

const Wrapper = styled.div`
  position: absolute;
  right: 0;
  top: 40px;
  width: 300px;
  margin-top: 0 !important;
  > :not(:first-child) {
    margin-top: 16px;
  }
  @media screen and (max-width: 1024px) {
    position: static;
    width: auto;
    margin-top: 16px !important;
  }
`;

export default function Vote({
  votes = [],
  prime,
  motionHash,
  motionIndex,
  isLoadingVote = false,
  onInBlock = emptyFunction,
  onFinalized = emptyFunction,
}) {
  const type = useDetailType();
  const [showPopup, setShowPopup] = useState(false);

  return (
    <>
      <Wrapper>
        <Voters votes={votes} isLoadingVote={isLoadingVote} prime={prime} />
        <Action refreshData={onFinalized} setShowPopup={setShowPopup} />
      </Wrapper>
      {showPopup && (
        <Popup
          votes={votes}
          motionHash={motionHash}
          motionIndex={motionIndex}
          type={type}
          onClose={() => setShowPopup(false)}
          onInBlock={onInBlock}
          onFinalized={onFinalized}
        />
      )}
    </>
  );
}
