import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import PrimaryButton from "next-common/lib/button/primary";
import { SystemLoadingDots, MenuFellowship } from "@osn/icons/subsquare";
import Divider from "next-common/components/styled/layout/divider";
import { useFellowshipCoreMembersCount } from "next-common/components/fellowship/collective/hook/useFellowshipCoreMembersFilter";
import { useChain } from "next-common/context/chain";
import { isCollectivesChain } from "next-common/utils/chain";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import Link from "next/link";
import { isAddressInGroup } from "next-common/utils";
import { useMemo } from "react";

export default function FellowshipApplicationGuide() {
  const chain = useChain();
  return !isCollectivesChain(chain) ? null : <ApplicationGuide />;
}

function ApplicationGuide() {
  const realAddress = useRealAddress();
  const { isLoading, coreMembersCount, coreCandidatesCount, sourseMembers } =
    useFellowshipCoreMembersCount();

  const isFellowshipMember = useMemo(
    () =>
      isAddressInGroup(
        realAddress,
        sourseMembers.map(({ address }) => address),
      ),
    [realAddress, sourseMembers],
  );

  if (isFellowshipMember || isLoading) {
    return null;
  }

  return (
    <SecondaryCard>
      <div className="flex gap-3 justify-between  flex-col sm:flex-row">
        <div className="bg-theme100 p-2 w-10 h-10 rounded-lg flex-shrink-0">
          <MenuFellowship className="text-theme500" />
        </div>
        <div className="flex flex-col w-full">
          <div className="flex-1">
            <h3 className="text14Bold text-textPrimary">Join Fellowship</h3>
            <p className="text14Medium text-textTertiary">
              Post a discussion about applying for fellowship membership
            </p>
          </div>
          <Divider className="my-3 " />
          <div className="flex text12Medium text-textTertiary">
            <div className="flex gap-1">
              Members
              {isLoading ? (
                <SystemLoadingDots className="w-4 h-4" />
              ) : (
                <Link href="fellowship/members" target="_blank">
                  <span className="text-theme500 text12Medium">
                    {coreMembersCount}
                  </span>
                </Link>
              )}
            </div>
            <div className="px-2">·</div>
            <div className="flex gap-1">
              Candidates
              {isLoading ? (
                <SystemLoadingDots className="w-4 h-4" />
              ) : (
                <Link href="/fellowship/members?tab=candidates" target="_blank">
                  <span className="text-theme500 text12Medium">
                    {coreCandidatesCount}
                  </span>
                </Link>
              )}
            </div>
          </div>
        </div>
        {!isFellowshipMember ? (
          <Link href="/fellowship/applications/create" target="_blank">
            <PrimaryButton>Apply</PrimaryButton>
          </Link>
        ) : null}
      </div>
    </SecondaryCard>
  );
}
