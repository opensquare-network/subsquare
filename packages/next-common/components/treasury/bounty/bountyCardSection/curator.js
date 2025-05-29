import CuratorInfoItem from "./curatorInfoItem";
import React from "react";
import { useCuratorMultisigAddress } from "next-common/hooks/treasury/bounty/useCuratorMultisigAddress";
import LoadableContent from "next-common/components/common/loadableContent";
import { isNil } from "lodash-es";

function Curator({ showBadge = true, curator }) {
  const { badge, signatories, loading } = useCuratorMultisigAddress(curator);

  return (
    <LoadableContent isLoading={loading && isNil(badge)}>
      <CuratorInfoItem
        curator={curator}
        signatories={signatories}
        badge={badge}
        showBadge={showBadge}
      />
    </LoadableContent>
  );
}

export default Curator;
