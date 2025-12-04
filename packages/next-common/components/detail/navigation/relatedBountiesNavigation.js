import { useOnchainData } from "../../../context/post";
import { NavigationWrapper } from "./navigators";
import React from "react";
import Link from "next-common/components/link";
import TreasuryBountiesTitleTooltip from "next-common/components/referenda/titleTooltip/treasuryBounties";
export default function ReferendaReferendumTreasuryBountiesNavigation() {
  const onchainData = useOnchainData();
  const { proposal } = onchainData;

  const bountyId = getBountyId(proposal?.call);

  if (!bountyId) {
    return null;
  }

  return (
    <NavigationWrapper>
      <span>Link to</span>
      <TreasuryBountiesTitleTooltip id={bountyId}>
        <Link href={`/treasury/bounties/${bountyId}`}>Bounty #{bountyId}</Link>
      </TreasuryBountiesTitleTooltip>
    </NavigationWrapper>
  );
}

function getBountyId(call = {}) {
  const { section, method, args = [] } = call;
  if ("bounties" !== section) {
    return null;
  }

  if (
    ![
      "closeBounty",
      "approveBounty",
      "unassignCurator",
      "proposeCurator",
      "approveBountyWithCurator",
    ].includes(method)
  ) {
    return null;
  }

  return args[0]?.value;
}
