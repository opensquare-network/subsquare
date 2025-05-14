import { SecondaryCardDetail } from "next-common/components/styled/containers/secondaryCard";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import styled from "styled-components";
import VoteBar from "next-common/components/referenda/voteBar";
import Aye from "./values/aye";
import Nay from "./values/nay";
import Support from "./values/support";
import { useApprovalThreshold } from "next-common/context/post/gov2/threshold";
import SupportBar from "./supportBar";
import Issuance from "./values/issuance";
import { useOnchainData } from "next-common/context/post";
import useSupportPerbill from "next-common/utils/gov2/tally/useSupportPerbill";
import useSubActiveIssuance from "next-common/hooks/referenda/useSubActiveIssuance";
import useReferendaIssuance from "next-common/hooks/referenda/useReferendaIssuance";
import CurvePopupOpener from "next-common/components/gov2/referendum/curvePopup";
import VotesInfo from "./votesInfo";
import { useReferendumTally } from "next-common/hooks/referenda/useReferendumInfo";
import useFetchReferendaTallyHistory from "next-common/utils/hooks/referenda/useFetchReferendaTallyHistory";
import ConfirmationEstimation from "next-common/components/tally/confirmationEstimation";
import {
  useApprovalPercentage,
  useSupportPercentage,
} from "next-common/context/post/gov2/percentage";

const Title = styled(TitleContainer)`
  margin-bottom: 16px;
  padding-left: 0;
  padding-right: 0;
`;

export default function Gov2Tally() {
  const { referendumIndex } = useOnchainData();
  useSubActiveIssuance();
  const tally = useReferendumTally();
  const approvalThreshold = useApprovalThreshold();
  const supportPerbill = useSupportPerbill(tally);

  const approvalPercentage = useApprovalPercentage(tally);
  const supportPercentage = useSupportPercentage(supportPerbill);

  useFetchReferendaTallyHistory(referendumIndex);
  const issuance = useReferendaIssuance();

  return (
    <SecondaryCardDetail>
      <Title>
        Tally
        <CurvePopupOpener tally={tally} supportPerbill={supportPerbill} />
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
      <ConfirmationEstimation
        approvePercentage={approvalPercentage}
        supportPercentage={supportPercentage}
      />

      <VotesInfo />
    </SecondaryCardDetail>
  );
}
