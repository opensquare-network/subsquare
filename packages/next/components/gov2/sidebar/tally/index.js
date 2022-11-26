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

  const tally = detail?.onchainData?.info?.tally;

  return (
    <SecondaryCardDetail>
      <Title>Tally</Title>
      <VoteBar tally={tally} />

      <Aye />
      <Nay />
      <Support />

      <Footer>
        <AllVotes />
        <VoteExtrinsics />
      </Footer>
    </SecondaryCardDetail>
  );
}
