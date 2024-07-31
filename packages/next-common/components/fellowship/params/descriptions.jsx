import { isNumber } from "lodash-es";
import BillBoardPanel from "next-common/components/billBoardPanel";
import ValueDisplay from "next-common/components/valueDisplay";
import { useSalaryAsset } from "next-common/hooks/useSalaryAsset";
import { toPrecision } from "next-common/utils";
import dynamic from "next/dynamic";
import Period from "./period";
import Flex from "next-common/components/styled/flex";

const MenuParameter = dynamic(() =>
  import("@osn/icons/subsquare/MenuParameter"),
);

const canBePromoteAnytime = "Can be promoted to a higher rank at anytime.";

function getCandidateInfoItems(params) {
  const { offboardTimeout } = params ?? {};

  return [
    <Flex key="offboard-period">
      Can be offboarded after &nbsp;
      <Period blocks={offboardTimeout} /> &nbsp;stay at rank 0.
    </Flex>,
    canBePromoteAnytime,
    "No salary.",
  ];
}

function getMemberInfoItems({ rank, params, decimals, symbol }) {
  const {
    activeSalary = [],
    passiveSalary = [],
    demotionPeriod = [],
    minPromotionPeriod = [],
  } = params ?? {};

  const idx = rank - 1;

  return [
    demotionPeriod[idx] === 0 ? (
      "Cannot be demoted."
    ) : (
      <Flex key="demotion-period">
        Can be demoted after&nbsp; <Period blocks={demotionPeriod[idx]} />{" "}
        &nbsp;stay at current rank.
      </Flex>
    ),
    minPromotionPeriod[rank] === 0 ? (
      canBePromoteAnytime
    ) : (
      <Flex key="promotion-period">
        Can be promoted to rank {rank + 1} after&nbsp;{" "}
        <Period blocks={minPromotionPeriod[rank]} /> &nbsp;stay at current rank.
      </Flex>
    ),
    <Flex key="active-salary">
      Active salary is&nbsp;
      <ValueDisplay
        value={toPrecision(activeSalary[idx], decimals)}
        symbol={symbol}
      />
      .
    </Flex>,
    <Flex key="passive-salary">
      Passive salary is&nbsp;
      <ValueDisplay
        value={toPrecision(passiveSalary[idx], decimals)}
        symbol={symbol}
      />
      .
    </Flex>,
  ];
}

function useRankInfoItems(rank, params) {
  const { symbol, decimals } = useSalaryAsset();

  if (!isNumber(rank)) {
    return [];
  }

  if (rank === 0) {
    return getCandidateInfoItems(params);
  }

  return getMemberInfoItems({ rank, params, decimals, symbol });
}

export default function CollectiveParamsDescriptions({ rank, params }) {
  const infoItems = useRankInfoItems(rank, params);
  return (
    <BillBoardPanel
      icon={<MenuParameter className="[&_path]:fill-theme500" />}
      items={infoItems}
    />
  );
}
