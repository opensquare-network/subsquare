import { SystemVoteAbstain, SystemVoteAye } from "@osn/icons/subsquare";

export default function FellowshipSalaryMemberIsRegistered({ status }) {
  const registered = status?.attempted || status?.registered;

  return registered ? (
    <SystemVoteAye className="inline-block w-4 h-4" />
  ) : (
    <SystemVoteAbstain className="inline-block w-4 h-4" />
  );
}
