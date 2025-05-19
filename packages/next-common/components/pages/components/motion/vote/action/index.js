import { usePostOnChainData } from "next-common/context/post";
import { isMotionEnded } from "next-common/utils";
import styled from "styled-components";
import useIsCollectiveMember from "next-common/utils/hooks/collectives/useIsCollectiveMember";
import PrimaryButton from "next-common/lib/button/primary";
import Close from "./close";
import { useDetailType } from "next-common/context/page";
import { useMemo } from "react";
import { detailPageCategory } from "next-common/utils/consts/business/category";

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

  const { isMember: userCanVote } = useIsCollectiveMember();
  const type = useDetailType();
  const memberTitle = useMemo(() => {
    if (detailPageCategory.TECH_COMM_MOTION === type) {
      return "tech.comm.";
    } else if (detailPageCategory.COUNCIL_MOTION === type) {
      return "council";
    } else {
      return "collective";
    }
  }, [type]);

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
        Only {memberTitle} members can vote, no account found from the council.{" "}
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
