import React from "react";
import CardHeaderLabel from "../cardHeaderLabel";
import CardTitleLabel from "../cardTitleLabel";
import Divider from "next-common/components/styled/layout/divider";
import CardBalanceAndCurator from "../cardBalanceAndCurator";
import { isNil } from "lodash-es";

function BountyDetailPopupSummary({ item }) {
  if (isNil(item)) return null;
  const { bountyIndex, title } = item;

  return (
    <div>
      <CardHeaderLabel data={item} className="p-0 m-0" />
      <CardTitleLabel bountyIndex={bountyIndex} title={title} />
      <Divider className="mt-4" />
      <CardBalanceAndCurator
        item={item}
        className="grid grid-cols-4 gap-3 mt-4"
      />
    </div>
  );
}

export default React.memo(BountyDetailPopupSummary);
