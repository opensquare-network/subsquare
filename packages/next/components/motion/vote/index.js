import styled from "styled-components";
import { useState } from "react";
import dynamic from "next/dynamic";
import { emptyFunction } from "next-common/utils";
import { useDetailType } from "next-common/context/page";
import Voters from "./voters";
import Action from "./action";
import { useChainSettings } from "next-common/context/chain";
import { detailPageCategory } from "next-common/utils/consts/business/category";
import isMoonChain from "next-common/utils/isMoonChain";

const VotePopup = dynamic(() => import("./popup"), {
  ssr: false,
});

const MoonVotePopup = dynamic(() => import("./popup/moonPopup"), {
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
  const { hideActionButtons } = useChainSettings();

  let Popup = VotePopup;
  if (isMoonChain()) {
    Popup = MoonVotePopup;
  }

  // No openTechComm precompile at the moment
  const noAction = type === detailPageCategory.OPEN_TECH_COMM_PROPOSAL;

  return (
    <>
      <Wrapper>
        <Voters votes={votes} isLoadingVote={isLoadingVote} prime={prime} />
        {!hideActionButtons && !noAction && (
          <Action refreshData={onFinalized} setShowPopup={setShowPopup} />
        )}
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
