import Tooltip from "next-common/components/tooltip";
import { SystemVoteAbstain, SystemVoteAye } from "@osn/icons/subsquare";

export function ApprovedTooltip({ isAccountMultisigPage = true }) {
  const content = `${
    isAccountMultisigPage ? "You" : "This account"
  } approved this multisig`;

  return (
    <Tooltip content={content}>
      <span className="inline-flex p-1.5">
        <SystemVoteAye className="w-4 h-4" />
      </span>
    </Tooltip>
  );
}

export function NotApprovedTooltip({ isAccountMultisigPage = true }) {
  const content = `${
    isAccountMultisigPage ? "You" : "This account"
  }  didn't sign this multisig`;

  return (
    <Tooltip content={content}>
      <span className="inline-flex p-1.5">
        <SystemVoteAbstain className="w-4 h-4" />
      </span>
    </Tooltip>
  );
}
