import AddressComboField from "next-common/components/popup/fields/addressComboField";
import PopupWithSigner from "next-common/components/popupWithSigner";
import { useExtensionAccounts } from "next-common/components/popupWithSigner/context";
import SignerWithBalance from "next-common/components/signerPopup/signerWithBalance";
import { incPreImagesTrigger } from "next-common/store/reducers/preImagesSlice";
import { getEventData } from "next-common/utils/sendTransaction";
import { useState } from "react";
import { useDispatch } from "react-redux";
import EnactmentBlocks from "next-common/components/summary/newProposalPopup/enactmentBlocks";
import { useRouter } from "next/router";
import RankField from "next-common/components/popup/fields/rankField";
import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import Chains from "next-common/utils/consts/chains";
import {
  useCollectivesSection,
  useReferendaFellowshipPallet,
} from "next-common/context/collectives/collectives";
import { CollectivesRetainTracks } from "next-common/components/fellowship/core/members/actions/approve/constants";
import AdvanceSettings from "next-common/components/summary/newProposalQuickStart/common/advanceSettings";
import useRelatedRetentionReferenda from "next-common/hooks/fellowship/useRelatedRetentionReferenda";
import { useChain } from "next-common/context/chain";
import {
  ReferendaActionMessage,
  ReferendaWarningMessage,
} from "next-common/components/summary/newProposalQuickStart/createFellowshipCoreMemberProposalPopup/common";
import { useFellowshipTrackDecisionDeposit } from "next-common/hooks/fellowship/useFellowshipTrackDecisionDeposit";
import { rankToRetainTrack } from "next-common/utils/fellowship/rankToTrack";
import { useReferendaOptionsField } from "next-common/components/preImages/createPreimagePopup/fields/useReferendaOptionsField";
import { useFellowshipProposalSubmissionTxFunc } from "next-common/hooks/fellowship/core/useFellowshipCoreMemberProposalSubmitTx";

export function getRetainTrackNameFromRank(chain, rank) {
  switch (chain) {
    case Chains.collectives:
    case Chains.westendCollectives:
      return CollectivesRetainTracks[rank];
    default:
      throw new Error("Unsupported chain");
  }
}

function PopupContent({ member }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const [enactment, setEnactment] = useState();
  const extensionAccounts = useExtensionAccounts();
  const [atRank, setAtRank] = useState(member?.rank);
  const chain = useChain();
  const trackName = getRetainTrackNameFromRank(chain, atRank);
  const [memberAddress, setMemberAddress] = useState(member?.address);
  const section = useCollectivesSection();
  const referendaPallet = useReferendaFellowshipPallet();
  const action = "approve";

  const decisionDeposit = useFellowshipTrackDecisionDeposit(
    rankToRetainTrack(atRank),
  );
  const { value: referendaOptions, component: referendaOptionsField } =
    useReferendaOptionsField(decisionDeposit);

  const getTxFunc = useFellowshipProposalSubmissionTxFunc({
    rank: atRank,
    who: memberAddress,
    action,
    trackName,
    enactment,
    checkDecisionDeposit: referendaOptions.checkDecisionDeposit,
    checkVoteAye: referendaOptions.checkVoteAye,
  });

  const { relatedReferenda, isLoading } = useRelatedRetentionReferenda(
    member?.address,
  );
  const referendaAlreadyCreated = relatedReferenda.length > 0;

  return (
    <>
      <SignerWithBalance />
      <AddressComboField
        title="Member"
        extensionAccounts={extensionAccounts}
        defaultAddress={memberAddress}
        setAddress={setMemberAddress}
        readOnly
      />
      <RankField title="At Rank" rank={atRank} setRank={setAtRank} readOnly />
      <ReferendaActionMessage
        rank={atRank}
        who={memberAddress}
        trackName={trackName}
        action={action}
      />
      <ReferendaWarningMessage
        isLoading={isLoading}
        relatedReferenda={relatedReferenda}
      />
      {!!memberAddress && !!atRank && referendaOptionsField}
      <AdvanceSettings>
        <EnactmentBlocks setEnactment={setEnactment} />
      </AdvanceSettings>
      <TxSubmissionButton
        disabled={isLoading || referendaAlreadyCreated}
        getTxFunc={getTxFunc}
        onInBlock={({ events }) => {
          const eventData = getEventData(events, referendaPallet, "Submitted");
          if (!eventData) {
            return;
          }
          const [referendumIndex] = eventData;
          router.push(`/${section}/referenda/${referendumIndex}`);
        }}
        onFinalized={() => dispatch(incPreImagesTrigger())}
      />
    </>
  );
}

export default function ApproveFellowshipMemberPopup({ member, onClose }) {
  return (
    <PopupWithSigner title="Approve Fellowship Member" onClose={onClose}>
      <PopupContent member={member} onClose={onClose} />
    </PopupWithSigner>
  );
}
