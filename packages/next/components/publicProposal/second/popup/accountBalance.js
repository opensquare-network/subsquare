import styled from "styled-components";
import { useState, useEffect, useContext } from "react";

import { useApi } from "utils/hooks";
import useIsMounted from "next-common/utils/hooks/useIsMounted";
import { getNode, toPrecision } from "utils";
import Loading from "next-common/components/loading";
import { StateContext } from "./stateContext";
import { BalanceWrapper } from "next-common/components/popup/styled"

const balanceMap = new Map();

export default function AccountBalance({ chain }) {
  const { signerAccount, signerBalance, setSignerBalance } =
    useContext(StateContext);

  const isMounted = useIsMounted();
  const [loadingBalance, setLoadingBalance] = useState(false);
  const node = getNode(chain);

  const api = useApi(chain);

  useEffect(() => {
    if (balanceMap.has(signerAccount?.address)) {
      setSignerBalance(balanceMap.get(signerAccount?.address));
      return;
    }
    if (api && signerAccount) {
      setLoadingBalance(true);
      api.query.system
        .account(signerAccount.address)
        .then((result) => {
          if (isMounted.current) {
            setSignerBalance(result.data.free);
            balanceMap.set(signerAccount.address, result.data.free);
          }
        })
        .finally(() => {
          if (isMounted.current) {
            setLoadingBalance(false);
          }
        });
    }
  }, [api, signerAccount, node.decimals, isMounted, setSignerBalance]);

  return (
    <BalanceWrapper>
      <div>Balance</div>
      <div>
        {loadingBalance ? (
          <Loading />
        ) : (
          toPrecision(signerBalance, node.decimals)
        )}
      </div>
    </BalanceWrapper>
  );
}
