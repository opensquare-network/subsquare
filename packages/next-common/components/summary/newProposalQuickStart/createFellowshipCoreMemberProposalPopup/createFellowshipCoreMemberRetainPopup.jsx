import RankField from "next-common/components/popup/fields/rankField";
import Popup from "next-common/components/popup/wrapper/Popup";
import { usePopupParams } from "next-common/components/popupWithSigner/context";
import useAddressComboField from "next-common/components/preImages/createPreimagePopup/fields/useAddressComboField";
import useFetchFellowshipCoreMembers from "next-common/hooks/fellowship/core/useFetchFellowshipCoreMembers";
import { fellowshipCoreMembersSelector } from "next-common/store/reducers/fellowship/core";
import { useSelector } from "react-redux";
import AdvanceSettings from "../common/advanceSettings";
import useEnactmentBlocksField from "../common/useEnactmentBlocksField";
import CreateFellowshipCoreMemberProposalSubmitButton from "./createFellowshipCoreMemberProposalSubmitButton";
import { find } from "lodash-es";
import { getRetainTrackNameFromRank } from "next-common/components/fellowship/core/members/actions/approve/popup";

export default function NewFellowshipCoreMemberRetainReferendumInnerPopup() {
  useFetchFellowshipCoreMembers();

  const { onClose } = usePopupParams();
  const { value: who, component: whoField } = useAddressComboField({
    title: "Who",
  });
  const { value: enactment, component: enactmentField } =
    useEnactmentBlocksField();
  const members = useSelector(fellowshipCoreMembersSelector);
  const targetMember = find(members, { address: who });

  const atRank = targetMember?.rank;

  const trackName = getRetainTrackNameFromRank(atRank);

  return (
    <Popup title="New Retain Proposal" onClose={onClose} wide>
      {whoField}
      <RankField title="At Rank" rank={atRank} readOnly />
      <AdvanceSettings>{enactmentField}</AdvanceSettings>
      <div className="flex justify-end">
        <CreateFellowshipCoreMemberProposalSubmitButton
          who={who}
          enactment={enactment}
          rank={atRank}
          action="approve"
          trackName={trackName}
        />
      </div>
    </Popup>
  );
}
