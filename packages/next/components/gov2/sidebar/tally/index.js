// bulk of copies from "components/referenda/tallyInfo"

import { SecondaryCardDetail } from "next-common/components/styled/containers/secondaryCard";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import styled from "styled-components";
import useFetchVotes from "next-common/utils/gov2/useFetchVotes";
import useFetchVoteExtrinsics from "next-common/utils/gov2/useFetchVoteExtrinsics";
import { useState } from "react";
import AllVotesPopup from "next-common/components/democracy/allVotesPopup";
import AllVoteExtrinsicsPopup from "../allVoteExtrinsicsPopup";
import {
  isLoadingVotesSelector,
  votesSelector,
} from "next-common/store/reducers/gov2ReferendumSlice";
import { useSelector } from "react-redux";
import VoteBar from "components/referenda/voteBar";
import Aye from "./values/aye";
import Nay from "./values/nay";
import Support from "./values/support";

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

const Button = styled.div`
  cursor: pointer;
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
  color: #6848ff;
`;

export default function Gov2Tally({ detail }) {
  const [showAllVotes, setShowAllVotes] = useState(false);
  const [showVoteExtrinsic, setShowVoteExtrinsic] = useState(false);
  const { allAye = [], allNay = [] } = useSelector(votesSelector);
  const isLoadingVotes = useSelector(isLoadingVotesSelector);

  useFetchVotes(detail?.onchainData);
  useFetchVoteExtrinsics(detail?.onchainData);

  const tally = detail?.onchainData?.info?.tally;

  return (
    <div>
      <SecondaryCardDetail>
        <Title>Tally</Title>
        <VoteBar tally={tally} />

        <Aye />
        <Nay />
        <Support />

        <Footer>
          <Button onClick={() => setShowAllVotes(true)}>All Votes</Button>
          <Button onClick={() => setShowVoteExtrinsic(true)}>
            Vote Extrinsics
          </Button>
        </Footer>
      </SecondaryCardDetail>
      {showAllVotes && (
        <AllVotesPopup
          setShowVoteList={setShowAllVotes}
          allAye={allAye}
          allNay={allNay}
          isLoadingVotes={isLoadingVotes}
        />
      )}
      {showVoteExtrinsic && (
        <AllVoteExtrinsicsPopup setShowVoteList={setShowVoteExtrinsic} />
      )}
    </div>
  );
}
