import { upperFirst } from "lodash-es";
import LoadableContent from "next-common/components/common/loadableContent";
import DotSplitter from "next-common/components/dotSplitter";
import { toClaimStatusLabel } from "next-common/components/fellowship/salary/claimants/utils";
import FellowshipSalaryStatsDetailLink from "next-common/components/overview/fellowship/salary/detailLink";
import { useMyAmbassadorSalaryClaimantFromContext } from "next-common/context/ambassador/myClaimant";
import useRealAddress from "next-common/utils/hooks/useRealAddress";

export default function AmbassadorSalaryMyStatus() {
  const realAddress = useRealAddress();
  const { isLoading, claimant } = useMyAmbassadorSalaryClaimantFromContext();

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
