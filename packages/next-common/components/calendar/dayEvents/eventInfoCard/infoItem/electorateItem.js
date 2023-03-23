import React from "react";
import ValueItem from "./valueItem";

export default function ElectorateItem({ electorate }) {
  return <ValueItem value={electorate} itemName="Electorate" />;
}
