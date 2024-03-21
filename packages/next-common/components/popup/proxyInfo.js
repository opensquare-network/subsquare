import React from "react";
import { isNil } from "lodash-es";
import { addressEllipsis } from "../../utils";
import { formatBalance } from "../../utils/viewfuncs";
import Loading from "../loading";
import Tooltip from "../tooltip";
import { GreyPanel } from "../styled/containers/greyPanel";
import { tryConvertToEvmAddress } from "next-common/utils/mixedChainUtil";

export default function ProxyInfo({ address, balance, isLoading, symbol }) {
  const noBalance = isNil(balance) && isNil(isLoading);
  const maybeEvmAddress = tryConvertToEvmAddress(address);
  const shortAddr = addressEllipsis(maybeEvmAddress);
  return (
    <GreyPanel className="mt-2 py-2.5 px-4 justify-between text14Medium text-textSecondary">
      <div>
        As proxy of{" "}
        <span className="text-textPrimary font-medium">{shortAddr}</span>{" "}
        <Tooltip content={"Extrinsic will be wrapped in a proxy call"} />
      </div>
      {!noBalance && (
        <div className="flex text12Bold text-textPrimary">
          {!isLoading && (
            <div>
              {formatBalance(balance, symbol)} {symbol}
            </div>
          )}
          {isLoading && <Loading />}
        </div>
      )}
    </GreyPanel>
  );
}
