import { TooltipWrapper, Label } from "./styled";
import VoteLockSelect from "./voteLockSelect";

export default function VoteLock({ voteLock, setVoteLock }) {
  return (
    <div>
      <TooltipWrapper>
        <Label>Vote lock</Label>
      </TooltipWrapper>
      <VoteLockSelect value={voteLock} setValue={setVoteLock} disabled={false} />
    </div>
  );
}
