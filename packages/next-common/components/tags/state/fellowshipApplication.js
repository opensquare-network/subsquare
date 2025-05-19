import React from "react";
import { PositiveTag } from "./styled";

export default function FellowshipApplicationTag({ state }) {
  if (state === "new") {
    return null;
  }
  return <PositiveTag>{state}</PositiveTag>;
}
