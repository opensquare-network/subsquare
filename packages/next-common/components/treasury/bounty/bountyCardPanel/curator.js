import CuratorInfoItem from "./curatorInfoItem";
import React from "react";
import { useCuratorMultisigAddress } from "next-common/hooks/treasury/bounty/useCuratorMultisigAddress";
import LoadableContent from "next-common/components/common/loadableContent";
import { isNil } from "lodash-es";

function Curator({ item, showBadge = true, curator }) {
  const { badge, signatories, loading } = useCuratorMultisigAddress(curator);

  return (
    <LoadableContent isLoading={loading && isNil(badge)}>
      <CuratorInfoItem
        signatories={signatories}
        data={item}
        badge={badge}
        showBadge={showBadge}
      />
    </LoadableContent>
  );
}

export default Curator;
