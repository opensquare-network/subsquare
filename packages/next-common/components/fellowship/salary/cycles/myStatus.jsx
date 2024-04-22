import useRealAddress from "next-common/utils/hooks/useRealAddress";
import DotSplitter from "next-common/components/dotSplitter";
import FellowshipSalaryStatsDetailLink from "next-common/components/overview/fellowship/salary/detailLink";
import LoadableContent from "next-common/components/common/loadableContent";
import { toClaimStatusLabel } from "../claimants/utils";
import { upperFirst } from "lodash-es";
import { useMySalaryClaimantFromContext } from "next-common/context/fellowship/myClaimant";

export default function FellowshipSalaryMyStatus() {
  const realAddress = useRealAddress();
  const { isLoading, claimant } = useMySalaryClaimantFromContext();

  if (!realAddress || !claimant) {
    return null;
  }

  const index = claimant?.lastActive;
  const event = toClaimStatusLabel(
    upperFirst(Object.keys(claimant?.status || {})[0]),
  );

  return (
    <div className="bg-neutral200 rounded py-1.5 px-3 text12Medium flex items-center">
      <div className="text12Bold text-textPrimary">My Status</div>
      <div className="ml-4 text-textTertiary inline-flex items-center gap-x-1">
        Last Active{" "}
        <LoadableContent size={12} isLoading={isLoading}>
          <FellowshipSalaryStatsDetailLink
            className="text12Medium"
            index={index}
          >
            #{index}
          </FellowshipSalaryStatsDetailLink>
        </LoadableContent>
      </div>

      <DotSplitter />

      <div className="text-textTertiary inline-flex items-center gap-x-1">
        Status{" "}
        <LoadableContent size={12} isLoading={isLoading}>
          <div className="text-textSecondary">{event}</div>
        </LoadableContent>
      </div>
    </div>
  );
}
