import { SecondaryCardDetail } from "next-common/components/styled/containers/secondaryCard";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import styled from "styled-components";
import useFetchVotes from "next-common/utils/gov2/useFetchVotes";
import VoteBar from "next-common/components/referenda/voteBar";
import Aye from "./values/aye";
import Nay from "./values/nay";
import Support from "./values/support";
import { useApprovalThreshold } from "next-common/context/post/gov2/threshold";
import SupportBar from "./supportBar";
import Issuance from "./values/issuance";
import { useTrack } from "next-common/context/post/gov2/track";
import MyVote from "./myVote";
import { usePost } from "next-common/context/post";
import useSupportPerbill from "next-common/utils/gov2/tally/useSupportPerbill";
import useSubActiveIssuance from "next-common/hooks/referenda/useSubActiveIssuance";
import useReferendaIssuance from "next-common/hooks/referenda/useReferendaIssuance";
import CurvePopup from "next-common/components/gov2/referendum/curvePopup";
import VotesInfo from "./votesInfo";
import { useChainSettings } from "next-common/context/chain";
import { useReferendumTally } from "next-common/hooks/referenda/useReferendumInfo";

const Title = styled(TitleContainer)`
  margin-bottom: 16px;
`;

export default function Gov2Tally() {
  const detail = usePost();
  useFetchVotes(detail?.onchainData);
  useSubActiveIssuance();
  const tally = useReferendumTally();
  const approvalThreshold = useApprovalThreshold();
  const supportPerbill = useSupportPerbill(tally);

  const issuance = useReferendaIssuance();
  const track = useTrack();
  const { showReferendaReferendumDelegationPercentage: showDelegationPercentage } = useChainSettings();

  let titleRightCorner = (
    <CurvePopup
      track={track}
      tally={tally}
      supportPerbill={supportPerbill}
    />
  );

  return (
    <SecondaryCardDetail>
      <Title>
        Tally
        {titleRightCorner}
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

      <VotesInfo />
      <MyVote />
    </SecondaryCardDetail>
  );
}
