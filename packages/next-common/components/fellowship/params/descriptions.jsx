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

const canBePromoteAnytime = "Can be promote to higher rank at anytime";

function getCandidateInfoItems(params) {
  const { offboardTimeout } = params ?? {};

  return [
    <Flex key="offboard-period">
      Offboard period is&nbsp;
      <Period blocks={offboardTimeout} />
    </Flex>,
    canBePromoteAnytime,
    "No salary",
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
      "Cannot be demoted"
    ) : (
      <Flex key="demotion-period">
        Demotion period is&nbsp;
        <Period blocks={demotionPeriod[idx]} />
      </Flex>
    ),
    minPromotionPeriod[idx] === 0 ? (
      canBePromoteAnytime
    ) : (
      <Flex key="promotion-period">
        Promotion period is&nbsp;
        <Period blocks={minPromotionPeriod[idx]} />
      </Flex>
    ),
    <Flex key="active-salary">
      Active salary is&nbsp;
      <ValueDisplay
        value={toPrecision(activeSalary[idx], decimals)}
        symbol={symbol}
      />
    </Flex>,
    <Flex key="passive-salary">
      Passive salary is&nbsp;
      <ValueDisplay
        value={toPrecision(passiveSalary[idx], decimals)}
        symbol={symbol}
      />
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
