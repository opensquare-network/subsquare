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
import useApprovalThreshold from "./threshold/useApprovalThreshold";
import useIssuance from "next-common/utils/gov2/useIssuance";
import SupportBar from "./supportBar";
import Issuance from "./values/issuance";
import MyVote from "./myVote";

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

export default function Gov2Tally({ detail }) {
  useFetchVotes(detail?.onchainData);
  useFetchVoteExtrinsics(detail?.onchainData);
  const tally = useTally();
  const approvalThreshold = useApprovalThreshold();

  const { issuance } = useIssuance();

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

      <SupportBar issuance={issuance} />

      <Support />
      <Issuance issuance={issuance} />

      <Footer>
        <AllVotes />
        <VoteExtrinsics />
      </Footer>

      <MyVote
        trackId={detail?.track}
        referendumIndex={detail?.referendumIndex}
      />
    </SecondaryCardDetail>
  );
}
