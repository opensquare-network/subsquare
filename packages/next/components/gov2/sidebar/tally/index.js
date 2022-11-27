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
import useApprovalThreshold from "./useApprovalThreshold";
import Issuance from "./values/issuance";
import useSupportThreshold from "./useSupportThreshold";

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
  console.log("approvalThreshold:", approvalThreshold);

  const supportThreshold = useSupportThreshold();
  console.log("supportThreshold:", supportThreshold);

  return (
    <SecondaryCardDetail>
      <Title>Tally</Title>
      <VoteBar tally={tally} />

      <Aye />
      <Nay />
      <Support />
      <Issuance />

      <Footer>
        <AllVotes />
        <VoteExtrinsics />
      </Footer>
    </SecondaryCardDetail>
  );
}
