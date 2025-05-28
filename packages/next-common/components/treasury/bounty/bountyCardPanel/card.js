import React from "react";
import { cn } from "next-common/utils";
import Divider from "next-common/components/styled/layout/divider";
import CardBalanceAndCurator from "./cardBalanceAndCurator";
import CardChildBounties from "./cardChildBounties";
import CardHeaderLabel from "./cardHeaderLabel";
import { isNil } from "lodash-es";
import ListPostTitle from "next-common/components/postList/postTitle";
import Tooltip from "next-common/components/tooltip";

function Card({ item, className = "" }) {
  if (isNil(item)) return null;

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
      <Tooltip content={item.title} className="my-3">
        <ListPostTitle data={item} href={item.detailLink} ellipsis />
      </Tooltip>
      <Divider />
      <CardBalanceAndCurator item={item} />
      <Divider />
      <CardChildBounties bountyIndex={item.bountyIndex} item={item} />
    </div>
  );
}

export default React.memo(Card);
