import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import PrimaryButton from "next-common/lib/button/primary";
import { MenuFellowship } from "@osn/icons/subsquare";
import Divider from "next-common/components/styled/layout/divider";
import { useChain } from "next-common/context/chain";
import { isCollectivesChain } from "next-common/utils/chain";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import Link from "next/link";
import { isAddressInGroup } from "next-common/utils";
import { useMemo } from "react";
import { useFellowshipCollectiveMembers } from "next-common/hooks/fellowship/core/useFellowshipCollectiveMembers";

export default function FellowshipApplicationGuide() {
  const chain = useChain();
  return !isCollectivesChain(chain) ? null : <ApplicationGuide />;
}

function ApplicationGuide() {
  const { members: all, loading } = useFellowshipCollectiveMembers();
  const members = (all || []).filter((m) => m.rank > 0);
  const candidates = (all || []).filter((m) => m.rank <= 0);
  const realAddress = useRealAddress();
  const isFellowshipMember = useMemo(
    () =>
      isAddressInGroup(
        realAddress,
        (all || []).map(({ address }) => address),
      ),
    [realAddress, all],
  );

  if (isFellowshipMember || loading || !realAddress) {
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
              Post a discussion to show your wish to join polkadot technical
              fellowship
            </p>
          </div>
          <Divider className="my-3 " />
          <div className="flex text12Medium text-textTertiary">
            <div className="flex gap-1">
              Members
              <Link href="/fellowship/members">
                <span className="text-theme500 text12Medium">
                  {members.length}
                </span>
              </Link>
            </div>
            <div className="px-2">·</div>
            <div className="flex gap-1">
              Candidates
              <Link href="/fellowship/members?tab=candidates">
                <span className="text-theme500 text12Medium">
                  {candidates.length}
                </span>
              </Link>
            </div>
          </div>
        </div>
        {!isFellowshipMember ? (
          <Link href="/fellowship/applications/create">
            <PrimaryButton>Apply</PrimaryButton>
          </Link>
        ) : null}
      </div>
    </SecondaryCard>
  );
}
