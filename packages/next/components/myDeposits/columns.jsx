import isNil from "lodash.isnil";
import ListPostTitle from "next-common/components/postList/postTitle";
import ValueDisplay from "next-common/components/valueDisplay";
import { toPrecision } from "next-common/utils";
import { CHAIN } from "next-common/utils/constants";
import getChainSettings from "next-common/utils/consts/settings";

export function getReasonPostTitleColumn() {
  return {
    name: "Reason",
    className: "text-left",
    cellRender(data) {
      return (
        <ListPostTitle
          className="line-clamp-1 mr-4 text14Medium"
          data={data}
          href={data.detailLink}
        />
      );
    },
  };
}

export function getBondBalanceColumn() {
  return {
    name: "Bond Balance",
    className: "w-40 text-right",
    cellRender(data) {
      const { decimals, symbol } = getChainSettings(CHAIN);

      const bond = data.bond;

      return !isNil(bond) ? (
        <ValueDisplay
          className="text14Medium text-textPrimary"
          value={toPrecision(bond, decimals)}
          symbol={symbol}
        />
      ) : (
        "--"
      );
    },
  };
}
