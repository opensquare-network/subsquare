import styled from "styled-components";
import { useState, useEffect } from "react";

import { useApi } from "utils/hooks";
import useIsMounted from "next-common/utils/hooks/useIsMounted";
import { getNode, toPrecision } from "utils";
import Loading from "./loading";

const BalanceWrapper = styled.div`
  display: flex;
  font-size: 12px;
  line-height: 100%;
  color: #506176;
  > :nth-child(2) {
    color: #1e2134;
    font-weight: bold;
    margin-left: 8px;
  }
`;

const balanceMap = new Map();

export default function AccountBalance({
  chain,
  account,
  balance,
  setBalance,
}) {
  const isMounted = useIsMounted();
  const [loadingBalance, setLoadingBalance] = useState(false);
  const node = getNode(chain);

  const api = useApi(chain);

  useEffect(() => {
    if (balanceMap.has(account?.address)) {
      setBalance(balanceMap.get(account?.address));
      return;
    }
    if (api && account) {
      setLoadingBalance(true);
      api.query.system
        .account(account.address)
        .then((result) => {
          if (isMounted.current) {
            setBalance(result.data.free);
            balanceMap.set(account.address, result.data.free);
          }
        })
        .finally(() => {
          if (isMounted.current) {
            setLoadingBalance(false);
          }
        });
    }
  }, [api, account, node.decimals, isMounted, setBalance]);

  return (
    <BalanceWrapper>
      <div>Balance</div>
      <div>
        {loadingBalance ? <Loading /> : toPrecision(balance, node.decimals)}
      </div>
    </BalanceWrapper>
  );
}
