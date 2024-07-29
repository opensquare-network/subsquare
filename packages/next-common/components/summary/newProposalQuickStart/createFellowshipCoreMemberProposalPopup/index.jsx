import RankField from "next-common/components/popup/fields/rankField";
import Popup from "next-common/components/popup/wrapper/Popup";
import { usePopupParams } from "next-common/components/popupWithSigner/context";
import useBeneficiaryField from "next-common/components/preImages/createPreimagePopup/fields/useBeneficiaryField";
import { useState } from "react";
import AdvanceSettings from "../common/advanceSettings";
import useEnactmentBlocksField from "../common/useEnactmentBlocksField";
import CreateFellowshipCoreMemberProposalSubmitButton from "./createFellowshipCoreMemberProposalSubmitButton";
import { getTrackNameFromRank } from "next-common/components/fellowship/core/members/actions/promote/popup";

export default function NewFellowshipCoreMemberReferendumInnerPopup() {
  const { onClose } = usePopupParams();
  const { value: who, component: whoField } = useBeneficiaryField({
    title: "Who",
  });
  const { value: enactment, component: enactmentField } =
    useEnactmentBlocksField();

  const [toRank, setToRank] = useState();

  const trackName = getTrackNameFromRank(toRank);

  return (
    <Popup title="New Promote Proposal" onClose={onClose} wide>
      {whoField}
      <RankField title="To Rank" rank={toRank} setRank={setToRank} />
      <AdvanceSettings>{enactmentField}</AdvanceSettings>
      <div className="flex justify-end">
        <CreateFellowshipCoreMemberProposalSubmitButton
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
