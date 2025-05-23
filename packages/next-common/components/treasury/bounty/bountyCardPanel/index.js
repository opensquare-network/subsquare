import React from "react";
import CardWrapper from "./cardWrapper";
import Card from "./card";
import BountyPanelTitle from "./bountyPanelTitle";

function BountyCardPanel({ activeBounties }) {
  return (
    <div>
      <BountyPanelTitle activeCount={activeBounties.length} />
      <CardWrapper>
        {activeBounties.map((item, index) => (
          <Card key={index} item={item} />
        ))}
      </CardWrapper>
    </div>
  );
}
export default BountyCardPanel;
