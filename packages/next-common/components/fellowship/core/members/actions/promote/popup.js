import AddressComboField from "next-common/components/popup/fields/addressComboField";
import RankField from "next-common/components/popup/fields/rankField";
import PopupWithSigner from "next-common/components/popupWithSigner";
import { useExtensionAccounts } from "next-common/components/popupWithSigner/context";
import SignerWithBalance from "next-common/components/signerPopup/signerWithBalance";
import { incPreImagesTrigger } from "next-common/store/reducers/preImagesSlice";
import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import EnactmentBlocks from "next-common/components/summary/newProposalPopup/enactmentBlocks";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import { useRouter } from "next/router";
import Chains from "next-common/utils/consts/chains";
import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import { getEventData } from "next-common/utils/sendTransaction";
import {
  useCollectivesSection,
  useReferendaFellowshipPallet,
} from "next-common/context/collectives/collectives";
import { CollectivesPromoteTracks } from "next-common/components/fellowship/core/members/actions/promote/constants";
import AdvanceSettings from "next-common/components/summary/newProposalQuickStart/common/advanceSettings";
import {
  ReferendaActionMessage,
  ReferendaWarningMessage,
} from "next-common/components/summary/newProposalQuickStart/createFellowshipCoreMemberProposalPopup/common";
import useRelatedPromotionReferenda from "next-common/hooks/fellowship/useRelatedPromotionReferenda";
import { useFellowshipTrackDecisionDeposit } from "next-common/hooks/fellowship/useFellowshipTrackDecisionDeposit";
import { rankToPromoteTrack } from "next-common/utils/fellowship/rankToTrack";
import { useReferendaOptionsField } from "next-common/components/preImages/createPreimagePopup/fields/useReferendaOptionsField";
import { useFellowshipCoreMemberProposalSubmitTx } from "next-common/hooks/fellowship/core/useFellowshipCoreMemberProposalSubmitTx";

export function getPromoteTrackNameFromRank(rank) {
  switch (process.env.NEXT_PUBLIC_CHAIN) {
    case Chains.collectives:
    case Chains.westendCollectives:
      return CollectivesPromoteTracks[rank];
    default:
      throw new Error("Unsupported chain");
  }
}

function PopupContent({ member }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const [enactment, setEnactment] = useState();
  const extensionAccounts = useExtensionAccounts();
  const [toRank, setToRank] = useState(member?.rank + 1);
  const trackName = getPromoteTrackNameFromRank(toRank);
  const [memberAddress, setMemberAddress] = useState(member?.address);
  const section = useCollectivesSection();
  const referendaPallet = useReferendaFellowshipPallet();
  const action = "promote";

  const decisionDeposit = useFellowshipTrackDecisionDeposit(
    rankToPromoteTrack(toRank),
  );
  const { value: referendaOptions, component: referendaOptionsField } =
    useReferendaOptionsField(decisionDeposit);

  const submitTxFunc = useFellowshipCoreMemberProposalSubmitTx({
    rank: toRank,
    who: memberAddress,
    action,
    trackName,
    enactment,
    checkDecisionDeposit: referendaOptions.checkDecisionDeposit,
    checkVoteAye: referendaOptions.checkVoteAye,
  });

  const getTxFunc = useCallback(async () => {
    if (toRank > 6) {
      dispatch(newErrorToast("Invalid rank"));
      return;
    }

    return await submitTxFunc();
  }, [toRank, submitTxFunc, dispatch]);

  const { relatedReferenda, isLoading } = useRelatedPromotionReferenda(
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
      <RankField title="To Rank" rank={toRank} setRank={setToRank} readOnly />
      <ReferendaActionMessage
        rank={toRank}
        who={memberAddress}
        trackName={trackName}
        action={action}
      />
      <ReferendaWarningMessage
        isLoading={isLoading}
        relatedReferenda={relatedReferenda}
      />
      {!!memberAddress && !!toRank && referendaOptionsField}
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

export default function PromoteFellowshipMemberPopup({ member, onClose }) {
  return (
    <PopupWithSigner title="Promote Fellowship Member" onClose={onClose}>
      <PopupContent member={member} onClose={onClose} />
    </PopupWithSigner>
  );
}
