import React, { useEffect, useState } from "react";
import { useOnchainData } from "next-common/context/post";
import NewChildBountyPopup from "./newChildBountyPopup";
import SplitRoleMenuButton from "next-common/components/splitRoleMenuButton";
import useAccountRole from "next-common/hooks/accountAuthority/useAccountRole";
import { useContextPapi } from "next-common/context/papi";
import Tooltip from "next-common/components/tooltip";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import useMultiAssetBountyStatus from "./useMultiAssetBountyStatus";

function useMultiAssetChildBountyLimit(bountyIndex) {
  const { api: papi, checkPallet } = useContextPapi();
  const [childBountiesCount, setChildBountiesCount] = useState(null);
  const [maxActiveChildBountyCount, setMaxActiveChildBountyCount] =
    useState(null);

  useEffect(() => {
    setChildBountiesCount(null);
    setMaxActiveChildBountyCount(null);
    if (
      !papi ||
      bountyIndex == null ||
      !checkPallet("MultiAssetBounties", "ChildBountiesPerParent")
    ) {
      return;
    }

    let cancelled = false;
    const countSub =
      papi.query.MultiAssetBounties.ChildBountiesPerParent.watchValue(
        bountyIndex,
      ).subscribe({
        next: ({ value }) => setChildBountiesCount(value ?? 0),
        error: (error) => {
          setChildBountiesCount(null);
          console.error(error);
        },
      });
    papi.constants.MultiAssetBounties.MaxActiveChildBountyCount()
      .then((value) => {
        if (!cancelled) {
          setMaxActiveChildBountyCount(value);
        }
      })
      .catch((error) => console.error(error));

    return () => {
      cancelled = true;
      countSub.unsubscribe();
    };
  }, [papi, bountyIndex, checkPallet]);

  return { childBountiesCount, maxActiveChildBountyCount };
}

export default function NewChildBountyButton() {
  const address = useRealAddress();
  const { bountyIndex } = useOnchainData();
  const [openRole, setOpenRole] = useState(null);
  const status = useMultiAssetBountyStatus(bountyIndex);
  const { childBountiesCount, maxActiveChildBountyCount } =
    useMultiAssetChildBountyLimit(bountyIndex);

  // The parent curator must be the origin of create_child_bounty. Read it
  // from the live on-chain bounty status (`Active { curator, update_due }`)
  // so the action reacts as soon as the curator changes on chain.
  const parentCurator = status?.value?.curator;
  const { loading: isRoleLoading, roles } = useAccountRole(parentCurator);

  // Actions require a connected account; hide the button when logged out.
  if (
    !address ||
    bountyIndex == null ||
    status?.type !== "Active" ||
    !parentCurator
  ) {
    return null;
  }

  let disabledTooltip = "";
  if (isRoleLoading) {
    disabledTooltip = "Loading curator roles";
  } else if (roles.length === 0) {
    disabledTooltip = "Only curators can create a child bounty";
  } else if (childBountiesCount == null || maxActiveChildBountyCount == null) {
    disabledTooltip = "Loading child bounty limit";
  } else if (childBountiesCount >= maxActiveChildBountyCount) {
    disabledTooltip = `This bounty has ${childBountiesCount} active child bounties which reach the max limit`;
  }

  return (
    <>
      <Tooltip content={disabledTooltip}>
        <SplitRoleMenuButton
          fullWidth
          action="New Child Bounty"
          roles={roles}
          disabled={!!disabledTooltip}
          onClick={setOpenRole}
        />
      </Tooltip>
      {openRole && !disabledTooltip && (
        <NewChildBountyPopup
          parentCurator={parentCurator}
          role={openRole}
          onClose={() => setOpenRole(null)}
        />
      )}
    </>
  );
}
