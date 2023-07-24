import { usePostOnChainData } from "next-common/context/post";
import { isMotionEnded } from "next-common/utils";
import styled from "styled-components";
import useIsCollectiveMember from "next-common/utils/hooks/collectives/useIsCollectiveMember";
import toApiCouncil from "next-common/utils/toApiCouncil";
import { useChain } from "next-common/context/chain";
import { useDetailType } from "next-common/context/page";
import PrimaryButton from "next-common/components/buttons/primaryButton";
import Close from "./close";

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
  const chain = useChain();
  const type = useDetailType();
  const mod = toApiCouncil(chain, type);
  const userCanVote = useIsCollectiveMember(mod);

  if (motionIsFinal) {
    return <Description>This vote has been closed.</Description>;
  }

  let action;
  if (userCanVote) {
    action = (
      <PrimaryButton secondary isFill onClick={() => setShowPopup(true)}>
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
