import { SecondaryCardDetail } from "next-common/components/styled/containers/secondaryCard";
import styled from "styled-components";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import Aye from "./aye";
import Nay from "./nay";
import BareAye from "./bareAye";
import MaxVoters from "./maxVoters";
import SupportBar from "../../../../gov2/sidebar/tally/supportBar";
import { useTally } from "next-common/context/post/gov2/referendum";
import useMaxVoters from "next-common/context/post/fellowship/useMaxVoters";
import { useApprovalThreshold } from "next-common/context/post/gov2/threshold";
import VoteBar from "../../../../referenda/voteBar";
import useFellowshipVotes from "next-common/utils/hooks/fellowship/useFellowshipVotes";
import useReferendumVotingFinishHeight from "next-common/context/post/referenda/useReferendumVotingFinishHeight";
import { useOnchainData } from "next-common/context/post";
import AllVotes from "./allVotes";

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
  const tally = useTally();
  const maxVoters = useMaxVoters();
  const approvalThreshold = useApprovalThreshold();

  const votingFinishHeight = useReferendumVotingFinishHeight();
  const { referendumIndex } = useOnchainData();
  const { votes, isLoading: isLoadingVotes } = useFellowshipVotes(
    referendumIndex,
    votingFinishHeight
  );

  return (
    <SecondaryCardDetail>
      <Title>Tally</Title>

      <VoteBar
        tally={tally}
        threshold="percentage"
        percentage={approvalThreshold}
      />
      <Aye />
      <Nay />

      <SupportBar support={tally?.bareAyes} issuance={maxVoters} />
      <BareAye />
      <MaxVoters />

      <Footer>
        <AllVotes votes={votes} isLoadingVotes={isLoadingVotes} />
      </Footer>
    </SecondaryCardDetail>
  );
}
