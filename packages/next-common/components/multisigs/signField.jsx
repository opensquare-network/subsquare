import Tooltip from "next-common/components/tooltip";
import { SystemVoteAbstain, SystemVoteAye } from "@osn/icons/subsquare";
import useRealAddress from "next-common/utils/hooks/useRealAddress";

export default function MultisigSignField({ multisig = {} }) {
  const realAddress = useRealAddress();

  const { approvals } = multisig;
  const isApproved = approvals?.includes(realAddress);

  const content = isApproved ? (
    <Tooltip content="You didn't sign this multisig">
      <span className="inline-flex p-1.5">
        <SystemVoteAbstain className="w-4 h-4" />
      </span>
    </Tooltip>
  ) : (
    <Tooltip content="You approved this multisig">
      <span className="inline-flex p-1.5">
        <SystemVoteAye className="w-4 h-4" />
      </span>
    </Tooltip>
  );

  return <div className="flex items-center justify-end gap-x-2">{content}</div>;
}
