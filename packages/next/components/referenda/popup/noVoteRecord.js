import { VotingStatusContent } from "next-common/components/popup/styled";
import PopupLabel from "next-common/components/popup/label";
import NoDataStatusBox from "next-common/components/popup/noDataStatusBox";

export default function NoVoteRecord() {
  return (
    <VotingStatusContent>
      <PopupLabel text={"Current voting"} />
      <NoDataStatusBox text={"No voting record"} />
    </VotingStatusContent>
  );
}
