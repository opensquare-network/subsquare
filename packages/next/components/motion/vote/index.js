import styled from "styled-components";
import { useState } from "react";
import dynamic from "next/dynamic";
import SecondaryButton from "next-common/components/buttons/secondaryButton";
import { emptyFunction, isMotionEnded } from "next-common/utils";
import useIsCollectiveMember from "next-common/utils/hooks/collectives/useIsCollectiveMember";
import toApiCouncil from "next-common/utils/toApiCouncil";
import { useChain } from "next-common/context/chain";
import { useDetailType } from "next-common/context/page";
import { usePostOnChainData } from "next-common/context/post";
import Voters from "./voters";

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

const Description = styled.div`
  font-size: 12px;
  line-height: 140%;
  color: ${(props) => props.theme.textTertiary};
  > span {
    color: ${(props) => props.theme.primaryPurple500};
    cursor: pointer;
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
  const chain = useChain();
  const [showPopup, setShowPopup] = useState(false);
  const userCanVote = useIsCollectiveMember(toApiCouncil(chain, type));

  const onchainData = usePostOnChainData();
  const motionIsFinal = isMotionEnded(onchainData);

  let action;
  if (motionIsFinal) {
    action = <Description>This vote has been closed.</Description>;
  } else if (userCanVote) {
    action = (
      <SecondaryButton secondary isFill onClick={() => setShowPopup(true)}>
        Vote
      </SecondaryButton>
    );
  } else {
    action = (
      <Description>
        Only council members can vote, no account found from the council.{" "}
        <span onClick={() => setShowPopup(true)}>Still vote</span>
      </Description>
    );
  }

  return (
    <>
      <Wrapper>
        <Voters votes={votes} isLoadingVote={isLoadingVote} prime={prime} />
        { action }
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
