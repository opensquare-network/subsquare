import React from "react";
import PrimeIcon from "../assets/imgs/icons/prime.svg";
import Tooltip from "./tooltip";

export default function PrimeAddressMark() {
  return (
    <Tooltip content={"Prime Voter"}>
      <div style={{ display: "flex" }}>
        <PrimeIcon />
      </div>
    </Tooltip>
  );
}
