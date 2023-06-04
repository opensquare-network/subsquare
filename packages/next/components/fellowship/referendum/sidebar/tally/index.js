import { SecondaryCardDetail } from "next-common/components/styled/containers/secondaryCard";
import styled from "styled-components";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import Aye from "./aye";
import Nay from "./nay";
import BareAye from "./bareAye";
import MaxVoters from "./maxVoters";
import SupportBar from "../../../../gov2/sidebar/tally/supportBar";
import { useApprovalThreshold } from "next-common/context/post/gov2/threshold";
import VoteBar from "next-common/components/referenda/voteBar";
import useFellowshipVotes from "next-common/utils/hooks/fellowship/useFellowshipVotes";
import useReferendumVotingFinishHeight from "next-common/context/post/referenda/useReferendumVotingFinishHeight";
import { useOnchainData } from "next-common/context/post";
import AllVotes from "./allVotes";
import useSubFellowshipTally from "next-common/hooks/fellowship/useSubFellowshipTally";
import useFellowshipTally from "next-common/hooks/fellowship/useFellowshipTally";
import useFellowshipPerbill from "next-common/utils/hooks/fellowship/useFellowshipPerbill";
import useFetchMaxVoters from "next-common/context/post/fellowship/useMaxVoters";
import CurveIconOrigin from "next-common/components/icons/curve";
import { useState } from "react";
import ThresholdCurvesGov2TallyPopup from "next-common/components/charts/thresholdCurve/gov2TallyPopup";
import useGov2ThresholdCurveData from "next-common/utils/hooks/useGov2ThresholdCurveData";
import { useTrack } from "next-common/context/post/gov2/track";
import { useApprovalPercentage, useSupportPercentage } from "next-common/context/post/gov2/percentage";

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

export default function FellowshipTally() {
  useSubFellowshipTally();
  useFetchMaxVoters();
  const tally = useFellowshipTally();
  const approvalThreshold = useApprovalThreshold();

  const votingFinishHeight = useReferendumVotingFinishHeight();
  const { referendumIndex } = useOnchainData();
  const { votes, isLoading: isLoadingVotes } = useFellowshipVotes(
    referendumIndex,
    votingFinishHeight
  );
  const supportPerbill = useFellowshipPerbill();
  const supportPercentage = useSupportPercentage(supportPerbill);

  const [showThresholdCurveDetailPopup, setShowThresholdCurveDetailPopup] = useState(false);
  const track = useTrack();
  const { labels, supportData, approvalData } = useGov2ThresholdCurveData(track);
  const approvalPercentage = useApprovalPercentage(tally);

  return (
    <SecondaryCardDetail>
      <Title>
        Tally
        <CurveIcon role="button" onClick={() => setShowThresholdCurveDetailPopup(true)} />
      </Title>

      <VoteBar
        tally={tally}
        threshold="percentage"
        percentage={approvalThreshold}
      />
      <Aye value={tally.ayes} />
      <Nay value={tally.nays} />

      <SupportBar supportPerbill={supportPerbill} />
      <BareAye value={tally.bareAyes} />
      <MaxVoters />

      <Footer>
        <AllVotes votes={votes} isLoadingVotes={isLoadingVotes} />
      </Footer>

      {showThresholdCurveDetailPopup && (
        <ThresholdCurvesGov2TallyPopup
          labels={labels}
          supportData={supportData}
          supportPerbill={supportPerbill}
          approvalData={approvalData}
          setShow={setShowThresholdCurveDetailPopup}
          supportPercentage={supportPercentage}
          approvalPercentage={approvalPercentage}
        />
      )}
    </SecondaryCardDetail>
  );
}
