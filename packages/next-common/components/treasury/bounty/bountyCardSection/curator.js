import CuratorInfoItem from "./curatorInfoItem";
import React from "react";
import LoadableContent from "next-common/components/common/loadableContent";
import { isNil } from "lodash-es";
import { useCuratorParams } from "next-common/context/treasury/bounties";

function Curator() {
  const { badge, loading } = useCuratorParams() ?? {};

  return (
    <LoadableContent isLoading={loading && isNil(badge)}>
      <CuratorInfoItem />
    </LoadableContent>
  );
}

export default Curator;
