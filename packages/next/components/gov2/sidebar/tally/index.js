import { SecondaryCardDetail } from "next-common/components/styled/containers/secondaryCard";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import styled from "styled-components";
import useFetchVotes from "next-common/utils/gov2/useFetchVotes";
import useFetchVoteExtrinsics from "next-common/utils/gov2/useFetchVoteExtrinsics";
import VoteBar from "next-common/components/referenda/voteBar";
import Aye from "./values/aye";
import Nay from "./values/nay";
import Support from "./values/support";
import FlattenedVotes from "./flattenedVotes";
import CallsVotes from "./callsVotes";
import { useApprovalThreshold } from "next-common/context/post/gov2/threshold";
import SupportBar from "./supportBar";
import Issuance from "./values/issuance";
import { useTrack } from "next-common/context/post/gov2/track";
import MyVote from "./myVote";
import { usePost } from "next-common/context/post";
import useSupportPerbill from "next-common/utils/gov2/tally/useSupportPerbill";
import {
  flex,
  gap_x,
  items_center,
  justify_between,
  text_primary,
} from "next-common/styles/tailwindcss";
import { p_12_medium } from "next-common/styles/componentCss";
import NestedVotes from "./nestedVotes";
import useSubReferendaTally from "next-common/hooks/referenda/useSubReferendaTally";
import useSubActiveIssuance from "next-common/hooks/referenda/useSubActiveIssuance";
import useReferendaIssuance from "next-common/hooks/referenda/useReferendaIssuance";
import CurvePopup from "next-common/components/gov2/referendum/curvePopup";
import PercentageBar from "./percentageBar";

const Title = styled(TitleContainer)`
  margin-bottom: 16px;
`;

const VotesGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 16px;
  gap: 8px;
`;

const VotesInfoLine = styled.div`
  ${flex};
  ${items_center};
  ${justify_between};
`;

const VotesGroupLabel = styled.div`
  ${p_12_medium};
  ${text_primary};
`;

const VotesGroupItems = styled.div`
  ${flex};
  ${items_center};
  ${gap_x(12)};
`;

export default function Gov2Tally() {
  const detail = usePost();
  useFetchVotes(detail?.onchainData);
  useFetchVoteExtrinsics(detail?.onchainData);
  useSubActiveIssuance();
  const tally = useSubReferendaTally();
  const approvalThreshold = useApprovalThreshold();
  const supportPerbill = useSupportPerbill(tally);

  const issuance = useReferendaIssuance();
  const track = useTrack();

  return (
    <SecondaryCardDetail>
      <Title>
        Tally
        <CurvePopup
          track={track}
          tally={tally}
          supportPerbill={supportPerbill}
        />
      </Title>
      <VoteBar
        tally={tally}
        threshold="percentage"
        percentage={approvalThreshold}
      />

      <Aye value={tally?.ayes} />
      <Nay value={tally?.nays} />

      <SupportBar supportPerbill={supportPerbill} />

      <Support supportPerbill={supportPerbill} value={tally?.support} />
      <Issuance issuance={issuance} />

      <VotesGroup>
        <VotesInfoLine>
          <VotesGroupLabel>Votes</VotesGroupLabel>
          <VotesGroupItems>
            <FlattenedVotes />
            <NestedVotes />
            <CallsVotes />
          </VotesGroupItems>
        </VotesInfoLine>
        <VotesInfoLine>
          <VotesGroupLabel>Capital Pct.</VotesGroupLabel>
          <PercentageBar
            percent={50}
            colorLeft="rgba(15, 111, 255, 0.4)"
            colorRight="rgba(232, 31, 102, 0.4)"
          />
        </VotesInfoLine>
        <VotesInfoLine>
          <VotesGroupLabel>Votes Pct.</VotesGroupLabel>
          <PercentageBar
            percent={50}
            colorLeft="rgba(255, 152, 0, 0.4)"
            colorRight="rgba(232, 31, 102, 0.4)"
          />
        </VotesInfoLine>
      </VotesGroup>

      <MyVote />
    </SecondaryCardDetail>
  );
}
