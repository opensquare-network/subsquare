import React, { useContext, useEffect } from "react";

import useApi from "../../../../utils/hooks/useSelectedEnpointApi";
import { getNode, toPrecision } from "../../../../utils";
import Loading from "../../../loading";
import { StateContext } from "./stateContext";
import { BalanceWrapper } from "../../../popup/styled";
import { formatBalance } from "../../../../utils/viewfuncs";

export default function AccountBalance({ chain, useAddressVotingBalance }) {
  const { signerAccount, setSignerBalance } = useContext(StateContext);

  const api = useApi(chain);
  const [balance, loadingBalance] = useAddressVotingBalance(
    api,
    signerAccount?.address
  );

  useEffect(() => {
    setSignerBalance(balance);
  }, [balance]);

  const node = getNode(chain);
  if (!node) {
    return null;
  }

  return (
    <BalanceWrapper>
      <div>Balance</div>
      <div>
        {loadingBalance ? (
          <Loading />
        ) : (
          formatBalance(toPrecision(balance ?? 0, node.decimals), node.symbol)
        )}
      </div>
    </BalanceWrapper>
  );
}
