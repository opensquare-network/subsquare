import Calls from "./voteCalls";
import Votes from "./votes";

export default function VotesInfo() {
  return (
    <div className="flex items-center justify-between mt-4">
      <div className="text12Medium text-textPrimary">Votes</div>
      <div className="flex items-center gap-x-3">
        <Votes />
        <Calls />
      </div>
    </div>
  );
}
