import CuratorInfoItem from "./curatorInfoItem";
import React from "react";
import LoadableContent from "next-common/components/common/loadableContent";
import { isNil } from "lodash-es";
import { useCuratorParams } from "next-common/context/treasury/bounties";

function Curator({ showBadge = true }) {
  const { badge, signatories, loading } = useCuratorParams();

  return (
    <LoadableContent isLoading={loading && isNil(badge)}>
      <CuratorInfoItem
        signatories={signatories}
        badge={badge}
        showBadge={showBadge}
      />
    </LoadableContent>
  );
}

export default Curator;
