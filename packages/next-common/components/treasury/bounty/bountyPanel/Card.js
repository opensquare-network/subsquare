import React from "react";
import { cn } from "next-common/utils";
// import useBountyDetailsData from "./hooks/useBountyDetailsData";
import { MenuBounties } from "@osn/icons/subsquare";
import Tooltip from "next-common/components/tooltip";
import Divider from "next-common/components/styled/layout/divider";
import ActiveLabel from "./ActiveLabel";
import Balance from "./Balance";
import Curator from "./Curator";
import ChildBountyItem from "./ChildBountyItem";

function Card({ item, className = "" }) {
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
      <span className="h-10 flex w-full justify-between items-center">
        <MenuBounties className="w-6 h-6 [&_path]:fill-textSecondary" />
        <ActiveLabel />
      </span>
      <Tooltip content={item.title}>
        <span className="my-3 w-full  line-clamp-1 text16Medium text-textPrimary">
          {`#${item.bountyIndex}`}
          <span className="text-textTertiary">{" · "}</span>
          {item.title}
        </span>
      </Tooltip>
      <Divider />
      <span className="mt-4 mb-3 flex">
        <Balance />
        <Curator item={item} />
      </span>
      <Divider />
      <ChildBountyItem />
    </div>
  );
}

export default React.memo(Card);
