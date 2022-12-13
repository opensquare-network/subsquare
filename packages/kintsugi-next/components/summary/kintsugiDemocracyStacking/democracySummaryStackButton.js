import React from "react";
import { Button } from "next-common/components/summary/styled";
import { useChain } from "next-common/context/chain";
import Chains from "next-common/utils/consts/chains";

export default function DemocracySummaryStackButton() {
  const chain = useChain();
  const href =
    Chains.kintsugi === chain
      ? "https://kintsugi.interlay.io/staking"
      : "https://kintsugi.interlay.io/staking";

  return (
    <a href={href} target="_blank">
      <Button>Stack</Button>
    </a>
  );
}
