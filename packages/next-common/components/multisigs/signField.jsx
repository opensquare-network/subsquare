import Tooltip from "next-common/components/tooltip";
import { SystemVoteAbstain, SystemVoteAye } from "@osn/icons/subsquare";
import { isSameAddress } from "next-common/utils";
import { usePathname } from "next/navigation";
import useProfileAddress from "next-common/components/profile/useProfileAddress";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useMemo } from "react";

export default function MultisigSignField({ multisig = {} }) {
  const { approvals } = multisig;
  const pathname = usePathname();
  const profileAddress = useProfileAddress();
  const realAddress = useRealAddress();

  const isApproved = useMemo(() => {
    if (pathname.startsWith("/user/")) {
      // on user profile multisigs page
      return approvals?.some((item) => isSameAddress(item, profileAddress));
    }

    return approvals?.some((item) => isSameAddress(item, realAddress));
  }, [approvals, pathname, profileAddress, realAddress]);

  const content = isApproved ? (
    <Tooltip content="You approved this multisig">
      <span className="inline-flex p-1.5">
        <SystemVoteAye className="w-4 h-4" />
      </span>
    </Tooltip>
  ) : (
    <Tooltip content="You didn't sign this multisig">
      <span className="inline-flex p-1.5">
        <SystemVoteAbstain className="w-4 h-4" />
      </span>
    </Tooltip>
  );

  return <div className="flex items-center justify-end gap-x-2">{content}</div>;
}
