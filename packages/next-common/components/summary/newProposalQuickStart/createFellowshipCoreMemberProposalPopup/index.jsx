import Popup from "next-common/components/popup/wrapper/Popup";
import { usePopupParams } from "next-common/components/popupWithSigner/context";
import useBeneficiaryField from "next-common/components/preImages/createPreimagePopup/fields/useBeneficiaryField";
import { useListPageType } from "next-common/context/page";
import { listPageCategory } from "next-common/utils/consts/business/category";
import SubmissionDeposit from "../../newProposalPopup/submissionDeposit";
import AdvanceSettings from "../common/advanceSettings";
import useEnactmentBlocksField from "../common/useEnactmentBlocksField";
import useTrackField from "../common/useTrackField";
import CreateFellowshipCoreMemberProposalSubmitButton from "./createFellowshipCoreMemberProposalSubmitButton";
import RankField from "next-common/components/popup/fields/rankField";
import { useState } from "react";

export default function NewFellowshipCoreMemberReferendumInnerPopup() {
  const listPageType = useListPageType();

  let pallet;
  if (listPageType === listPageCategory.FELLOWSHIP_REFERENDA) {
    pallet = "fellowshipReferenda";
  } else if (listPageType === listPageCategory.AMBASSADOR_REFERENDA) {
    pallet = "ambassadorReferenda";
  }

  const { onClose } = usePopupParams();
  const { value: who, component: whoField } = useBeneficiaryField({
    title: "Who",
  });
  const { value: trackId } = useTrackField();
  const { value: enactment, component: enactmentField } =
    useEnactmentBlocksField(trackId);

  const [toRank, setToRank] = useState();

  return (
    <Popup title="New Promote Proposal" onClose={onClose} wide>
      {whoField}
      <RankField title="To Rank" rank={toRank} setRank={setToRank} />
      <AdvanceSettings>
        {enactmentField}
        <SubmissionDeposit pallet={pallet} />
      </AdvanceSettings>
      <div className="flex justify-end">
        <CreateFellowshipCoreMemberProposalSubmitButton
          trackId={trackId}
          who={who}
          enactment={enactment}
          toRank={toRank}
        />
      </div>
    </Popup>
  );
}
