import React from "react";
import {
  CollectivesTag,
  DemocracyTag,
  OpenGovTag,
  TreasuryTag,
} from "../../../tags/business";

export default function EventTag({ event }) {
  if (event.category === "Treasury") {
    return <TreasuryTag />;
  } else if (event.category === "Democracy") {
    return <DemocracyTag />;
  } else if (event.category === "OpenGov") {
    return <OpenGovTag />;
  } else if (event.category === "Collectives") {
    return <CollectivesTag />;
  }
}
