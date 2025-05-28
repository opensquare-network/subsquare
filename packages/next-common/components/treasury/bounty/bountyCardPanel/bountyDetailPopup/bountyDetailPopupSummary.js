import React from "react";
import CardHeaderLabel from "../cardHeaderLabel";
import Divider from "next-common/components/styled/layout/divider";
import CardBalanceAndCurator from "../cardBalanceAndCurator";
import { isNil } from "lodash-es";
import ListPostTitle from "next-common/components/postList/postTitle";
import Tooltip from "next-common/components/tooltip";

function BountyDetailPopupSummary({ item }) {
  if (isNil(item)) return null;
  return (
    <div>
      <CardHeaderLabel data={item} className="p-0 m-0" />
      <Tooltip content={item.title} className="my-3">
        <ListPostTitle data={item} href={item.detailLink} ellipsis />
      </Tooltip>
      <Divider className="mt-4" />
      <CardBalanceAndCurator
        item={item}
        className="grid grid-cols-4 gap-3 mt-4"
      />
    </div>
  );
}

export default React.memo(BountyDetailPopupSummary);
