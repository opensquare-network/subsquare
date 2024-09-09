import { usePostOnChainData } from "next-common/context/post";
import { isMotionEnded } from "next-common/utils";
import styled from "styled-components";
import useIsCollectiveMember from "next-common/utils/hooks/collectives/useIsCollectiveMember";
import PrimaryButton from "next-common/lib/button/primary";
import Close from "./close";
import { useCollectivePallet } from "next-common/context/collective";

const Description = styled.div`
  font-size: 12px;
  line-height: 140%;
  color: var(--textTertiary);

  > span {
    color: var(--theme500);
    cursor: pointer;
  }
`;

export default function Action({ setShowPopup }) {
  const onchainData = usePostOnChainData();
  const motionIsFinal = isMotionEnded(onchainData);
  const pallet = useCollectivePallet();

  const { isMember: userCanVote } = useIsCollectiveMember(pallet);

  if (motionIsFinal) {
    return <Description>This vote has been closed.</Description>;
  }

  let action;
  if (userCanVote) {
    action = (
      <PrimaryButton className="w-full" onClick={() => setShowPopup(true)}>
        Vote
      </PrimaryButton>
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
      {action}
      <Close />
    </>
  );
}
