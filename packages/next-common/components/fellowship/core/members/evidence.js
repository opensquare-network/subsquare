import FieldLoading from "next-common/components/icons/fieldLoading";
import FellowshipMemberInfoWrapper from "./infoWrapper";
import FellowshipMemberInfoTitle from "./title";

export default function FellowshipCoreMemberEvidence() {
  return (
    <FellowshipMemberInfoWrapper>
      <FellowshipMemberInfoTitle>Evidence</FellowshipMemberInfoTitle>
      <div>
        <FieldLoading size={16} />
      </div>
    </FellowshipMemberInfoWrapper>
  );
}
