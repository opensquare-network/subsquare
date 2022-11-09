import React, { useContext, useEffect } from "react";

import useApi from "../../../../utils/hooks/useApi";
import { getNode, toPrecision } from "../../../../utils";
import Loading from "../../../loading";
import { StateContext } from "./stateContext";
import { BalanceWrapper } from "../../../popup/styled";
import { formatBalance } from "../../../../utils/viewfuncs";
import { useChainSettings } from "../../../../context/chain";

export default function AccountBalance({ useAddressVotingBalance }) {
  const { signerAccount, setSignerBalance } = useContext(StateContext);

  const api = useApi();
  const [balance, loadingBalance] = useAddressVotingBalance(
    api,
    signerAccount?.address
  );

  useEffect(() => {
    setSignerBalance(balance);
  }, [balance]);

  const node = useChainSettings();
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
