import React from "react";
import ValueItem from "./valueItem";

export default function TurnoutItem({ turnout }) {
  return <ValueItem value={turnout} itemName="Turnout" />;
}
