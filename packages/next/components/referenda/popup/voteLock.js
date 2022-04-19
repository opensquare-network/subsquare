import PopupLabel from "next-common/components/popup/label";
import VoteLockSelect from "./voteLockSelect";

export default function VoteLock({ voteLock, setVoteLock }) {
  return (
    <div>
      <PopupLabel text={"Vote lock"} />
      <VoteLockSelect
        value={voteLock}
        setValue={setVoteLock}
        disabled={false}
      />
    </div>
  );
}
