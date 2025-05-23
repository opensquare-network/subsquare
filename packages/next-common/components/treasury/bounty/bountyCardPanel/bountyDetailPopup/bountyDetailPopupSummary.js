import React from "react";
import CardHeaderLabel from "../cardHeaderLabel";
import CardTitleLabel from "../cardTitleLabel";
import Divider from "next-common/components/styled/layout/divider";
import CardBalanceAndCurator from "../cardBalanceAndCurator";
function BountyDetailPopupSummary({ item, bountyIndex }) {
  return (
    <div>
      <CardHeaderLabel
        menuClassName="inline-block flex w-10 h-10 items-center justify-center bg-neutral200 rounded-[8px]"
        className="p-0 m-0"
      />
      <CardTitleLabel bountyIndex={bountyIndex} title="Bounty 1" />
      <Divider className="mt-4" />
      <CardBalanceAndCurator
        item={item}
        className="grid grid-cols-4 gap-3 mt-4"
        showBadge={false}
      />
    </div>
  );
}

export default React.memo(BountyDetailPopupSummary);
