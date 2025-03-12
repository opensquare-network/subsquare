import SecondaryButton from "next-common/lib/button/secondary";
import { SystemMenu } from "@osn/icons/subsquare";

export default function VotesPowerDetail({ setDetailOpen }) {
  return (
    <SecondaryButton
      className="w-7 h-7 p-0 flex-shrink-0"
      size="small"
      onClick={() => {
        setDetailOpen(true);
      }}
    >
      <SystemMenu className="w-4 h-4" />
    </SecondaryButton>
  );
}
