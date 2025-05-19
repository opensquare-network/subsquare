import CommonPanel from "next-common/components/profile/bio/commonPanel";
import VotesPowerValueDisplay from "../valueDisplay";

export default function OpenGovVotesPowerDetailHeader() {
  return (
    <CommonPanel>
      <VotesPowerValueDisplay />
    </CommonPanel>
  );
}
