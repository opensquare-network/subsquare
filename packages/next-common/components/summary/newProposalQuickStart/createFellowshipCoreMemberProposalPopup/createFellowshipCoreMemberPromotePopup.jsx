import RankField from "next-common/components/popup/fields/rankField";
import Popup from "next-common/components/popup/wrapper/Popup";
import { usePopupParams } from "next-common/components/popupWithSigner/context";
import useAddressComboField from "next-common/components/preImages/createPreimagePopup/fields/useAddressComboField";
import { useState } from "react";
import AdvanceSettings from "../common/advanceSettings";
import useEnactmentBlocksField from "../common/useEnactmentBlocksField";
import CreateFellowshipCoreMemberProposalSubmitButton from "./createFellowshipCoreMemberProposalSubmitButton";
import { getTrackNameFromRank } from "next-common/components/fellowship/core/members/actions/promote/popup";
import { useReferendaFellowshipPallet } from "next-common/context/collectives/collectives";
import { ActiveReferendaProvider } from "next-common/context/activeReferenda";
import { WarningMessage } from "next-common/components/setting/styled";
import Loading from "next-common/components/loading";
import useRelatedPromotionReferenda from "next-common/hooks/fellowship/useRelatedPromotionReferenda";

function NewFellowshipCoreMemberPromoteReferendumInnerPopupImpl() {
  const { onClose } = usePopupParams();
  const { value: who, component: whoField } = useAddressComboField({
    title: "Who",
  });
  const { value: enactment, component: enactmentField } =
    useEnactmentBlocksField();

  const [toRank, setToRank] = useState();

  const trackName = getTrackNameFromRank(toRank);

  const { relatedReferenda, isLoading } = useRelatedPromotionReferenda(who);
  const referendaAlreadyCreated = relatedReferenda.length > 0;

  let warningMessage = null;

  if (isLoading) {
    warningMessage = (
      <div className="flex justify-center py-[12px]">
        <Loading size={20} />
      </div>
    );
  }

  if (referendaAlreadyCreated) {
    warningMessage = (
      <WarningMessage>
        There is a promotion{" "}
        <a
          className="underline"
          target="_blank"
          rel="noreferrer"
          href={`/fellowship/referenda/${relatedReferenda[0].referendumIndex}`}
        >
          referendum #{relatedReferenda[0].referendumIndex}
        </a>{" "}
        currently in progress
      </WarningMessage>
    );
  }

  return (
    <Popup title="New Promote Proposal" onClose={onClose}>
      {whoField}
      <RankField title="To Rank" rank={toRank} setRank={setToRank} />
      {warningMessage}
      <AdvanceSettings>{enactmentField}</AdvanceSettings>
      <div className="flex justify-end">
        <CreateFellowshipCoreMemberProposalSubmitButton
          disabled={isLoading || referendaAlreadyCreated}
          tooltip
          who={who}
          enactment={enactment}
          rank={toRank}
          action="promote"
          trackName={trackName}
        />
      </div>
    </Popup>
  );
}

export default function NewFellowshipCoreMemberPromoteReferendumInnerPopup() {
  const pallet = useReferendaFellowshipPallet();
  return (
    <ActiveReferendaProvider pallet={pallet}>
      <NewFellowshipCoreMemberPromoteReferendumInnerPopupImpl />
    </ActiveReferendaProvider>
  );
}
