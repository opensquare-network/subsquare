import React from "react";
import { cn } from "next-common/utils";
import useBountyDetailsData from "./hooks/useBountyDetailsData";
import Divider from "next-common/components/styled/layout/divider";
import CardBalanceAndCurator from "./cardBalanceAndCurator";
import CardChildBounties from "./cardChildBounties";
import CardHeaderLabel from "./cardHeaderLabel";
import CardTitleLabel from "./cardTitleLabel";
import { isNil } from "lodash-es";

function Card({ item, className = "" }) {
  const childBountiesData = useBountyDetailsData(item.bountyIndex);
  if (isNil(childBountiesData)) return null;

  return (
    <div
      className={cn(
        "bg-neutral100",
        "p-6",
        "shadow-100",
        "rounded-[12px]",
        "border",
        "border-neutral300",
        className,
      )}
    >
      <CardHeaderLabel data={item} />
      <CardTitleLabel bountyIndex={item.bountyIndex} title={item.title} />
      <Divider />
      <CardBalanceAndCurator item={item} />
      <Divider />
      <CardChildBounties
        isChildBountiesLoading={childBountiesData.isLoading}
        childBounties={childBountiesData?.bountyData?.childBounties ?? {}}
        bountyIndex={item.bountyIndex}
        item={item}
      />
    </div>
  );
}

export default React.memo(Card);
