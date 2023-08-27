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
import useFellowshipPerbill from "next-common/utils/hooks/fellowship/useFellowshipPerbill";
import useFetchMaxVoters from "next-common/context/post/fellowship/useMaxVoters";
import CurvePopup from "next-common/components/gov2/referendum/curvePopup";
import Calls from "./voteCalls";
import { useChainSettings } from "next-common/context/chain";
import { useFellowshipReferendumTally } from "next-common/hooks/fellowship/useFellowshipReferendumInfo";

const Title = styled(TitleContainer)`
  margin-bottom: 16px;
`;

const Footer = styled.div`
  display: flex;
  > :not(:first-child) {
    margin-left: 16px;
  }
  margin-top: 16px;
`;

export default function FellowshipTally() {
  useFetchMaxVoters();
  const tally = useFellowshipReferendumTally();
  const approvalThreshold = useApprovalThreshold();
  const { useVoteCall } = useChainSettings();

  const votingFinishHeight = useReferendumVotingFinishHeight();
  const { referendumIndex } = useOnchainData();
  useFellowshipVotes(referendumIndex, votingFinishHeight);
  const supportPerbill = useFellowshipPerbill();

  return (
    <SecondaryCardDetail>
      <Title className="!px-0">
        Tally
        <CurvePopup
          tally={tally}
          supportPerbill={supportPerbill}
          isFellowship={true}
        />
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
        <AllVotes />
        {useVoteCall && <Calls />}
      </Footer>
    </SecondaryCardDetail>
  );
}
