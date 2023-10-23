import { VotingStatusContent } from "next-common/components/popup/styled";
import PopupLabel from "next-common/components/popup/label";

export default function NoVoteRecord() {
  return (
    <VotingStatusContent>
      <PopupLabel text={"Current voting"} />
      <div className="flex justify-center py-[12px] text14Medium text-textTertiary">
        No voting record
      </div>
    </VotingStatusContent>
  );
}
