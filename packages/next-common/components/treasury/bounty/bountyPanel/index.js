import React from "react";
import CardWrapper from "./CardWrapper";
import Card from "./Card";
import BountyPanelTitle from "./BountyPanelTitle";

function BountyPanel({ activeBounties }) {
  return (
    <div>
      <BountyPanelTitle activeCount={activeBounties.length} />
      <CardWrapper>
        {activeBounties.map((item, index) => (
          <Card key={index} item={item}></Card>
        ))}
      </CardWrapper>
    </div>
  );
}
export default BountyPanel;
