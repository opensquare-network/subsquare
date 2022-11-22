import PopupLabel from "next-common/components/popup/label";
import VoteLockSelect from "./voteLockSelect";

export default function VoteLock({
  voteLock,
  setVoteLock,
  title = "Vote lock",
}) {
  return (
    <div>
      <PopupLabel text={title} />
      <VoteLockSelect
        value={voteLock}
        setValue={setVoteLock}
        disabled={false}
      />
    </div>
  );
}
