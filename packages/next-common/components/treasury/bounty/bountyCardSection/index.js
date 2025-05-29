import React from "react";
import CardWrapper from "./cardWrapper";
import Card from "./card";
import { isNil } from "lodash-es";
import ListTitleBar from "next-common/components/listTitleBar";

function BountyCardSection({ activeBounties }) {
  if (isNil(activeBounties)) return null;

  return (
    <div>
      <ListTitleBar
        className="mb-4"
        title="Active"
        titleCount={activeBounties.length}
      />
      <CardWrapper>
        {activeBounties.map((item, index) => (
          <Card key={index} item={item} />
        ))}
      </CardWrapper>
    </div>
  );
}
export default BountyCardSection;
