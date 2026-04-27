import React, { useEffect, useState } from "react";
import { SystemMenu } from "@osn/icons/subsquare";
import SecondaryButton from "next-common/lib/button/secondary";
import { isNil } from "lodash-es";
import LoadableContent from "next-common/components/common/loadableContent";
import { GreyPanel } from "next-common/components/styled/containers/greyPanel";
import { backendApi } from "next-common/services/nextApi";
import useRefCallback from "next-common/hooks/useRefCallback";
import Link from "next-common/components/link";

function useMultiAssetChildBountiesCount(bountyIndex) {
  const [isLoading, setIsLoading] = useState(false);
  const [total, setTotal] = useState(null);

  const fetch = useRefCallback(async () => {
    if (isNil(bountyIndex)) return;
    try {
      setIsLoading(true);
      const { result } = await backendApi.fetch(
        `treasury/multi-asset-bounties/${bountyIndex}/multi-asset-child-bounties`,
        { pageSize: 1, page: 1 },
      );
      setTotal(result?.total ?? 0);
    } finally {
      setIsLoading(false);
    }
  });

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { isLoading, total };
}

function MultiAssetBountyCardChildBounties({ bountyIndex }) {
  const { isLoading, total } = useMultiAssetChildBountiesCount(bountyIndex);

  if (isNil(bountyIndex)) return null;

  return (
    <span className="mt-4 flex items-center">
      <GreyPanel className="flex-1 h-7 leading-7 px-3 text-textTertiary text12Medium flex items-center">
        Child Bounties&nbsp;
        <LoadableContent isLoading={isLoading}>
          <span className="text12Medium text-textSecondary">{total ?? 0}</span>
        </LoadableContent>
      </GreyPanel>
      <Link
        href={`/treasury/multi-asset-child-bounties?parentBountyId=${bountyIndex}`}
      >
        <SecondaryButton
          disabled={!total}
          size="small"
          className="ml-2 p-0 h-7 w-7"
        >
          <SystemMenu className="w-4 h-4" />
        </SecondaryButton>
      </Link>
    </span>
  );
}

export default React.memo(MultiAssetBountyCardChildBounties);
