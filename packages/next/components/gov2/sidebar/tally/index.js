import { SecondaryCardDetail } from "next-common/components/styled/containers/secondaryCard";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import styled from "styled-components";
import useFetchVotes from "next-common/utils/gov2/useFetchVotes";
import useFetchVoteExtrinsics from "next-common/utils/gov2/useFetchVoteExtrinsics";
import VoteBar from "components/referenda/voteBar";
import Aye from "./values/aye";
import Nay from "./values/nay";
import Support from "./values/support";
import AllVotes from "./allVotes";
import VoteExtrinsics from "./voteExtrinsics";
import { useTally } from "next-common/context/post/gov2/referendum";
import { useApprovalThreshold } from "next-common/context/post/gov2/threshold";
import useIssuance from "next-common/utils/gov2/useIssuance";
import SupportBar from "./supportBar";
import Issuance from "./values/issuance";
import CurveIconOrigin from "next-common/components/icons/curve";
import ThresholdCurvesGov2TallyPopup from "next-common/components/charts/thresholdCurve/gov2TallyPopup";
import { useState } from "react";
import { useTrack } from "next-common/context/post/gov2/track";
import useGov2ThresholdCurveData from "next-common/utils/hooks/useGov2ThresholdCurveData";
import MyVote from "./myVote";
import { usePost } from "next-common/context/post";

const Title = styled(TitleContainer)`
  margin-bottom: 16px;
`;

const CurveIcon = styled(CurveIconOrigin)`
  cursor: pointer;

  &:hover {
    path {
      stroke: ${(p) => p.theme.textSecondary};
    }
  }
`;

const Footer = styled.div`
  display: flex;
  > :not(:first-child) {
    margin-left: 16px;
  }
  margin-top: 16px;
`;

export default function Gov2Tally() {
  const detail = usePost();
  useFetchVotes(detail?.onchainData);
  useFetchVoteExtrinsics(detail?.onchainData);
  const tally = useTally();
  const approvalThreshold = useApprovalThreshold();
  const [showThresholdCurveDetailPopup, setShowThresholdCurveDetailPopup] =
    useState(false);

  const { issuance } = useIssuance();

  const track = useTrack();
  const { labels, supportData, approvalData } =
    useGov2ThresholdCurveData(track);

  function showThresholdCurveDetail() {
    setShowThresholdCurveDetailPopup(true);
  }

  return (
    <SecondaryCardDetail>
      <Title>
        Tally
        <CurveIcon role="button" onClick={showThresholdCurveDetail} />
      </Title>
      <VoteBar
        tally={tally}
        threshold="percentage"
        percentage={approvalThreshold}
      />

      <Aye />
      <Nay />

      <SupportBar />

      <Support />
      <Issuance issuance={issuance} />

      <Footer>
        <AllVotes />
        <VoteExtrinsics />
      </Footer>

      <MyVote />

      {showThresholdCurveDetailPopup && (
        <ThresholdCurvesGov2TallyPopup
          labels={labels}
          supportData={supportData}
          approvalData={approvalData}
          setShow={setShowThresholdCurveDetailPopup}
        />
      )}
    </SecondaryCardDetail>
  );
}
