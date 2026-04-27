import React from "react";
import { isNil } from "lodash-es";
import ListTitleBar from "next-common/components/listTitleBar";
import { cn } from "next-common/utils";
import MultiAssetBountyCard from "./card";

function CardWrapper({ children }) {
  return (
    <div
      className={cn(
        "grid",
        "grid-cols-1",
        "md:grid-cols-2",
        "lg:grid-cols-3",
        "gap-4",
        "mb-6",
      )}
    >
      {children}
    </div>
  );
}

function MultiAssetBountyCardSection({ activeBounties }) {
  if (isNil(activeBounties) || activeBounties.length === 0) return null;

  return (
    <div>
      <ListTitleBar
        className="mb-4"
        title="Active"
        titleCount={activeBounties.length}
      />
      <CardWrapper>
        {activeBounties.map((item, index) => (
          <MultiAssetBountyCard key={index} item={item} />
        ))}
      </CardWrapper>
    </div>
  );
}

export default MultiAssetBountyCardSection;
