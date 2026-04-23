import React from "react";
import { MenuBounties } from "@osn/icons/subsquare";
import { cn } from "next-common/utils";
import businessCategory from "next-common/utils/consts/business/category";
import Tag from "next-common/components/tags/state/tag";

function MultiAssetBountyCardHeaderLabel({ className = "", data }) {
  return (
    <span
      className={cn("h-10 flex w-full justify-between items-center", className)}
    >
      <span className="flex w-10 h-10 items-center justify-center bg-neutral200 rounded-[8px]">
        <MenuBounties className="w-6 h-6 [&_path]:fill-textSecondary" />
      </span>
      {data?.status && (
        <Tag
          state={data.status}
          category={businessCategory.multiAssetBounties}
          data={data}
        />
      )}
    </span>
  );
}

export default React.memo(MultiAssetBountyCardHeaderLabel);
